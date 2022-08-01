const jwt = require('jsonwebtoken');
import { NextFunction, Request, Response } from 'express'


export function authenticateToken(req: any, res: any, next: NextFunction) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (token == null) return res.sendStatus(401)

    jwt.verify(token, process.env.JWT_SECRET as string, (err: any, user: any) => {
        console.debug('authenticate...')

        if (err) return res.sendStatus(403)

        console.debug('success! user: ', user)
        req.user = user;

        next()
    })
}


export function generateAccessToken(email: string) {
    return jwt.sign({
        email: email
        // TODO: exp field
    }, process.env.JWT_SECRET, { expiresIn: '1h' });
}

const api = {
    generateAccessToken
}

export default api;