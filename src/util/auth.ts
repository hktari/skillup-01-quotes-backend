const jwt = require('jsonwebtoken');
import { NextFunction, Request, Response } from 'express'
import User from '../models/users';


export function authenticateToken(req: any, res: any, next: NextFunction) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (token == null) return res.sendStatus(401)

    console.debug('authenticate...')
    jwt.verify(token, process.env.JWT_SECRET as string, async (err: any, userToken: any) => {

        if (err) {
            console.log(err);
            return res.sendStatus(403)
        }

        try {
            console.log('retrieving use data');
            const user = await User.findOne({
                where: {
                    email: userToken.email
                },
                attributes: {
                    exclude: ['password']
                }
            })
            if (!user) {
                console.log(`user ${userToken.email} not found.`)
                return res.status(400).json({ error: 'user not found.' });
            }

            req.user = user;
            console.debug('success! user: ', userToken)
            next();
        } catch (error) {
            console.error('failed to fetch user data', error);
            return res.status(500).json(error);
        }
    })
}


export function generateAccessToken(email: string) {
    return jwt.sign({
        email: email
    }, process.env.JWT_SECRET, { expiresIn: '1h' });
}

const api = {
    generateAccessToken
}

export default api;