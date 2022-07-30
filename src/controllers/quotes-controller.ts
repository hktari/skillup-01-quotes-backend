import { NextFunction, Request, Response } from 'express'
import Quotes from '../models/quotes'
import Votes from '../models/votes'
import { Quote as QuoteDTO, User as UserDTO, AllQuotes, VoteState } from '../common/interface'
import * as Sequelize from 'sequelize'
import db from '../util/database'
import { Query } from 'pg'

const express = require('express');
const router = express.Router()

router.route('/')
    .get(async (req: Request, res: Response, next: NextFunction) => {
        console.log('getAll QUOTES')
        try {
            type QueryResult = {
                id: number,
                text: string,
                voteCount: number
                userId: number,
                username: string,
                userProfileImg: string
            }
            const queryResult: QueryResult[] = await db.query(`SELECT quotes.id, text, "voteCount", "userId", users.username, users."userProfileImg"
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
    .post(async (req: Request, res: Response, next: NextFunction) => {
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

router.route('/:id')
    .get(async (req: Request, res: Response, next: NextFunction) => {
        console.log('getOne QUOTES ', req.params.id);

        // TODO: escape 'id' parameter before using in query
        const queryResult = await db.query(`SELECT quotes.id, quotes.text, quotes.voteCount, users.id, users.username, users.userProfileImg
                                            FROM quotes INNER JOIN users ON quotes.id = users.userId
                                            WHERE quotes.id = ${req.params.id}`,
            { type: Sequelize.QueryTypes.SELECT, raw: true })

        console.log('getOne QUOTES OK ', queryResult.dataValues);
        return res.status(200).json(queryResult.dataValues);
    })

router.post('/:id/vote', async (req: Request, res: Response, next: NextFunction) => {
    const QUOTE_ID = req.params.id;
    // TODO: get userId from token
    const USER_ID = req.body.userId;

    console.log('vote QUOTES ', QUOTE_ID, 'VOTE: ', req.body.voteState, 'userId: ', USER_ID)

    try {
        let quote = await Quotes.findByPk(QUOTE_ID);
        if (!quote) {
            return res.status(404).end();
        }

        console.log('vote QUOTE found ');

        await Votes.find({ quoteId: QUOTE_ID, userId: USER_ID })

        // either +1 or -1
        const voteCountModifier = (Number)(req.body.voteState);

        let [vote, created] = await Votes.findOrCreate({
            where: {
                quoteId: QUOTE_ID,
                userId: USER_ID,
                voteState: voteCountModifier
            }
        })

        if (created) {
            console.log('vote CREATE OK');

            console.log(`quote voteCount: ${quote.get("voteCount")} + ${voteCountModifier}`)

            quote.set("voteCount", quote.get("voteCount") + voteCountModifier)
            quote = await quote.save();
            console.log('quote voteCount CHANGE  OK');
        } else {
            // check if the user has changed his vote
            if (vote.voteState !== voteCountModifier) {
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
        }

        return res.status(200).json(quote);
    } catch (error) {
        console.error('vote QUOTES ERR', error);
        return res.status(400).json(error);
    }
})




export default router;