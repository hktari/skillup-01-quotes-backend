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

const bcrypt = require("bcrypt");

router.post('/signup', async (req: Request, res: Response, next: NextFunction) => {
    console.log('signup: [POST]');

    try {
        console.debug('hashing password...')
        const pwdHash = await bcrypt.hash(req.body.password, 5);
        const USER_MODEL = {
            username: req.body.username,
            email: req.body.email,
            password: pwdHash,
        }

        try {
            const user = await Users.create(USER_MODEL);
            console.log('OK signup USER: ', user.dataValues);
            return res.status(201).json(user);
        } catch (error) {
            console.error('ERROR in signup ', error)
            return res.status(500).json(error);
        }
    } catch (error) {
        return res.status(400).json('Bad Request');
    }

})

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
        if (!await bcrypt.compare(req.body.password, user.password)) {
            console.debug('invalid credentials')
            return res.status(400).json({ error: 'invalid credentials' })
        }

        const token = generateAccessToken(req.body.email);
        let payload = {
            ...user.dataValues,
            token: token
        }
        payload.password = null;
        console.debug(`payload`, payload);
        return res.status(200).json(payload);

    } catch (error) {
        console.error(error);
        return res.status(400).json(error);
    }
})

export default router;