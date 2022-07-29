import { NextFunction, Request, Response } from 'express'
import Quotes from '../models/quotes'
import Votes from '../models/votes'
import {Quote as QuoteDTO, User as UserDTO, AllQuotes, VoteState} from '../common/interface'
import * as Sequelize from 'sequelize'
import db from '../util/database'

const express = require('express');
const router = express.Router()

router.route('/')
    .get(async (req: Request, res: Response, next: NextFunction) => {
        console.log('getAll QUOTES')
        const queryResult = await db.query(`SELECT id, text, voteCount, userId, users.username, users.userProfileImg
                        FROM quotes INNER JOIN users ON quotes.id = users.userId`,
                        { type: Sequelize.QueryTypes.SELECT, raw: true })
        console.log('getAll QUOTES OK', queryResult)

        return res.status(200).json(queryResult);
    })



const api = {

}

export default api;