import { NextFunction, Request, Response } from 'express'
import { addHeadersToResponse } from './server-helpers'
import sequelize from './util/database'
import User from './models/users'
import { createNoSubstitutionTemplateLiteral } from 'typescript';

export async function createOne(req: Request, res: Response, next: NextFunction) {
    console.log('createOne: [POST] /users/');

    try {
        const USER_MODEL = {
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
        }

        try {
            const user = await User.create(USER_MODEL);
            console.log('OK createOne USER: ', user);
            return res.status(201).json(user);
        } catch (error) {
            console.error('ERROR in createOne ', error)
            return res.status(500).json(error);
        }
    } catch (error) {
        return res.status(400).json('Bad Request');
    }
}

export async function getAll(req:Request, res:Response, next:NextFunction) {
    console.log('getAll: [GET] /users/');
    try {
        const ALL = await User.findAll()
        console.log(
            'OK getAll USER: ',
            ALL.map((el:any) => el.dataValues),
        )
        return res.status(200).json(ALL);
    } catch (error) {
        console.error('getAll USER', error);
        return res.status(500).json(error);
    }
}