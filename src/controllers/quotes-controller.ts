import { NextFunction, Request, Response } from 'express'
import Quotes from '../models/quotes'
import Votes from '../models/votes'
import { Quote as QuoteDTO, User as UserDTO, AllQuotes, VoteState } from '../common/interface'
import * as Sequelize from 'sequelize'
import db from '../util/database'
import { Query } from 'pg'
import { authenticateToken } from '../util/auth'
import User from '../models/users'
import { getUserIdByEmail } from '../util/common'

const express = require('express');
const router = express.Router()

type QuotesQuery = {
    id: number,
    text: string,
    voteCount: number
    userId: number,
    username: string,
    userProfileImg: string,
    voteState: any
}

function parseVoteState(voteState: any): VoteState {
    return voteState === null ? VoteState.novote : voteState as VoteState
}

router.route('/')
    .get(authenticateToken, async (req: any, res: Response, next: NextFunction) => {
        console.log('getAll QUOTES')
        console.debug('logged in user: ', req.user.email)

        try {
            const loggedInUserId = await getUserIdByEmail(req.user.email);

            const queryResult: QuotesQuery[] = await db.query(
                `SELECT quotes.id, text, "voteCount", quotes."userId", users.username, users."userProfileImg", votes."voteState"
                FROM quotes INNER JOIN users ON quotes."userId" = users.id
                LEFT OUTER JOIN votes ON votes."userId" = ${loggedInUserId} AND votes."quoteId" = quotes.id;`,
                { type: Sequelize.QueryTypes.SELECT, raw: true })

            console.log('getAll QUOTES OK', queryResult)

            // TODO: use sequelize to map query to model
            const endResult = queryResult.map<QuoteDTO>(q => {
                return {
                    id: q.id,
                    text: q.text,
                    voteCount: q.voteCount,
                    voteState: parseVoteState(q.voteState),
                    user: {
                        id: q.userId,
                        username: q.username,
                        karmaPoints: 0, // TODO
                        profileImg: {
                            thumbnailUrl: q.userProfileImg
                        }
                    }
                }
            })

            return res.status(200).json(endResult);
        } catch (error) {
            console.error(error);
            return res.status(500).json(error)
        }
    })


router.get('/most-liked', async (req: Request, res: Response, next: NextFunction) => {

    try {
        const mostLikedQuotes = await Quotes.findAll({
            order: [['voteCount', 'DESC']]
        })

        return res.status(200).json(mostLikedQuotes);
    } catch (error) {
        console.error(error);
        return res.status(500).json(error);
    }
})

router.get('/most-recent', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const mostRecentQuotes = await Quotes.findAll({
            order: [['createdAt', 'DESC']]
        })

        return res.status(200).json(mostRecentQuotes);
    } catch (error) {
        console.error(error);
        return res.status(500).json(error);
    }
})

router.get('/random', async (req: Request, res: Response, next: NextFunction) => {
    console.log('[GET] /quotes/random')

    const quoteCnt = await Quotes.count();

    if (quoteCnt === 0) {
        return res.status(200).json({})
    }

    const randIdx = Math.floor(Math.random() * quoteCnt);
    console.debug(`quoteCnt: ${quoteCnt}\trandIdx: ${randIdx}`);

    const randomQuoteQuery = await Quotes.findAll(
        {
            offset: randIdx, limit: 1, include: {
                model: User,
                attributes: { exclude: ['password'] }
            }
        })

    console.debug('random quote: ', randomQuoteQuery[0].dataValues);
    return res.status(200).json(randomQuoteQuery[0]);
})


router.route('/:id')
    .get(authenticateToken, async (req: Request, res: Response, next: NextFunction) => {
        console.log('getOne QUOTES ', req.params.id);

        try {
            // TODO: escape 'id' parameter before using in query
            const queryResult: QuotesQuery[] = await db.query(`SELECT quotes.id, text, "voteCount", "userId", users.username, users."userProfileImg"
                FROM quotes INNER JOIN users ON quotes."userId" = users.id
                WHERE quotes.id = ${req.params.id}`,
                { type: Sequelize.QueryTypes.SELECT, raw: true })

            console.log('getOne QUOTES OK ', queryResult);
            return res.status(200).json(queryResult);
        } catch (error) {
            console.error(error);

        }
    })

router.post('/:id/vote', authenticateToken, async (req: any, res: Response, next: NextFunction) => {
    const QUOTE_ID = req.params.id;
    const USER_ID = await getUserIdByEmail(req.user.email);

    console.log('vote QUOTES ', QUOTE_ID, 'VOTE: ', req.body.voteState, 'userId: ', USER_ID)

    try {
        let quote = await Quotes.findByPk(QUOTE_ID);
        if (!quote) {
            return res.status(404).end();
        }

        console.log('QUOTE found');

        // either +1 or -1
        if (req.body.voteState < -1 || req.body.voteState > 1) {
            return res.sendStatus(400)
        }

        const voteCountModifier = (Number)(req.body.voteState);

        const votes = await quote.getVotes({
            where: {
                userId: USER_ID,
                quoteId: QUOTE_ID
            }
        });

        if (votes.length > 0) {
            let vote = votes[0];
            // check if the user has changed his vote
            if (+vote.get("voteState") !== voteCountModifier) {
                vote.set("voteState", voteCountModifier);
                vote = await vote.save();
                console.log('vote UPDATE OK');


                const curVoteCount = +quote.get("voteCount")
                // in the case of vote change the vote count needs to be changed by 2
                const changeVoteCountMod = voteCountModifier * 2;

                console.log(`quote voteCount: ${curVoteCount} + ${changeVoteCountMod}`)
                quote.set("voteCount", curVoteCount + changeVoteCountMod)
                quote = await quote.save();
                console.log('quote voteCount CHANGE OK');
            }
        } else {
            const vote = await quote.createVote({
                userId: USER_ID,
                voteState: voteCountModifier
            })
            console.log('vote CREATE OK');

            console.log(`quote voteCount: ${quote.get("voteCount")} + ${voteCountModifier}`)
            quote.set("voteCount", quote.get("voteCount") + voteCountModifier)
            quote = await quote.save();
        }

        return res.status(200).json(quote);
    } catch (error) {
        console.error('vote QUOTES ERR', error);
        return res.status(400).json(error);
    }
})


export default router;