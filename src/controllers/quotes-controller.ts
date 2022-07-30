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
            const queryResult : QueryResult[] = await db.query(`SELECT quotes.id, text, "voteCount", "userId", users.username, users."userProfileImg"
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
                    user:{
                        id: q.userId,
                        username: q.username,
                        karmaPoints: 0, // TODO
                        profileImg:{
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
    console.log('vote QUOTES ', req.params.id, 'VOTE: ', req.body.voteState)

    try {
        const quote = await Quotes.findByPk(req.params.id);
        // TODO: get userId from token
        await Votes.findOrCreate({
            where: {
                quoteId: req.params.id,
                userId: 99,
                voteState: req.body.voteState
            }
        })
        console.log('vote QUOTES OK ', quote);
        return res.status(200).json(quote.dataValues);
    } catch (error) {
        console.error('vote QUOTES ERR', error);
        return res.status(400).json(error);
    }
})




export default router;