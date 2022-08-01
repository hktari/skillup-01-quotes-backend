import { NextFunction, Request, Response } from 'express'
import Quotes from '../models/quotes'
import Votes from '../models/votes'
import { Quote as QuoteDTO, User as UserDTO, AllQuotes, VoteState } from '../common/interface'
import * as Sequelize from 'sequelize'
import db from '../util/database'
import { Query } from 'pg'
import { generateAccessToken } from "../util/auth"
import Users from '../models/users'

const express = require('express');
const router = express.Router()

router.post('/login', async (req: Request, res: Response, next: NextFunction) => {
    console.debug('login: ', req.body.email)
    console.debug(`email: ${req.body.email}: ${req.body.password}`)

    try {
        const user = await Users.findOne({
            where: {
                email: req.body.email
            }
        })

        if (!user) {
            console.debug('user not found');
            return res.status(400).json({ error: 'user not found' })
        }

        if (user.password !== req.body.password) {
            console.debug('invalid credentials')
            return res.status(400).json({ error: 'invalid credentials' })
        }

        const token = generateAccessToken(req.body.email);
        return res.status(200).json(token);

    } catch (error) {
        console.error(error);
        return res.status(400).json(error);
    }
})

export default router;