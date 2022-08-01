import { NextFunction, Request, Response } from 'express'
import Quotes from '../models/quotes'
import Votes from '../models/votes'
import { Quote as QuoteDTO, User as UserDTO, AllQuotes, VoteState } from '../common/interface'
import * as Sequelize from 'sequelize'
import db from '../util/database'
import { Query } from 'pg'
import { authenticateToken } from '../util/auth'


const express = require('express');
const router = express.Router()

type QuotesQuery = {
    id: number,
    text: string,
    voteCount: number
    userId: number,
    username: string,
    userProfileImg: string
}


router.route('/')
    .get(authenticateToken, async (req: Request, res: Response, next: NextFunction) => {
        console.log('getAll QUOTES')
        try {
            const queryResult: QuotesQuery[] = await db.query(`SELECT quotes.id, text, "voteCount", "userId", users.username, users."userProfileImg"
            FROM quotes INNER JOIN users ON quotes."userId" = users.id`,
                { type: Sequelize.QueryTypes.SELECT, raw: true })

            console.log('getAll QUOTES OK', queryResult)

            // TODO: use sequelize to map query to model
            const endResult = queryResult.map<QuoteDTO>(q => {
                return {
                    id: q.id,
                    text: q.text,
                    voteCount: q.voteCount,
                    voteState: VoteState.novote, // TODO,
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
    .post(authenticateToken, async (req: Request, res: Response, next: NextFunction) => {
        const USER_ID = req.body.userId; // TODO: get userid from token

        console.log('createOne QUOTES', `user: ${USER_ID}`);

        try {
            const QUOTE = await Quotes.create({ userId: USER_ID, text: req.body.text })
            console.log('createOne QUOTES', 'OK', QUOTE.dataValues)
            return res.status(200).json(QUOTE);
        } catch (error) {
            return res.status(400).json(error);
        }
    })


router.get('/most-liked', async (req: Request, res: Response, next: NextFunction) => {

    // todo:
    return res.status(404).send('not implemented');
})

router.get('/most-recent', async (req: Request, res: Response, next: NextFunction) => {
    // todo
    return res.status(404).send('not implemented');
})

router.get('/random', async (req: Request, res: Response, next: NextFunction) => {

    // todo
    return res.status(404).send('not implemented');
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

router.post('/:id/vote', authenticateToken, async (req: Request, res: Response, next: NextFunction) => {
    const QUOTE_ID = req.params.id;
    // TODO: get userId from token
    const USER_ID = req.body.userId;

    console.log('vote QUOTES ', QUOTE_ID, 'VOTE: ', req.body.voteState, 'userId: ', USER_ID)

    try {
        let quote = await Quotes.findByPk(QUOTE_ID);
        if (!quote) {
            return res.status(404).end();
        }

        console.log('QUOTE found');

        // either +1 or -1
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