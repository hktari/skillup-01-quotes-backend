import { NextFunction, Request, Response } from 'express'
import User from '../models/users'


async function getAll(req: Request, res: Response, next: NextFunction) {
    console.log('getAll: [GET] /users/');
    try {
        const ALL = await User.findAll({
            attributes: {
                exclude: ['password']
            }
        }
        )
        console.log(
            'OK getAll USER: ',
            ALL.map((el: any) => el.dataValues),
        )
        return res.status(200).json(ALL);
    } catch (error) {
        console.error('getAll USER', error);
        return res.status(500).json(error);
    }
}

async function getOne(req: Request, res: Response, next: NextFunction) {
    const ID = req.params.id;
    console.log('getOne: [GET] /users/' + ID)

    try {
        const USER = await User.findByPk(ID,
            {
                attributes: {
                    exclude: ['password']
                }
            }
        )
        if (USER) {
            console.log('OK getOne USER: ', USER?.dataValues)
            return res.status(200).json(USER);
        }
        else {
            console.log('NOT FOUND getOne USER ', ID)
            return res.status(404).end();
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json(error);
    }
}

async function updateOne(req: Request, res: Response, next: NextFunction) {
    return res.status(400).send("not implemented");
}

async function deleteOne(req: Request, res: Response, next: NextFunction) {
    const ID = req.params.id;
    console.log('deleteOne: [DELETE] /users/' + ID);

    try {
        const deleteCount = await User.destroy({
            where: {
                id: ID
            },
            truncate: true,
            cascade: true // delete quotes and votes ? 
        })

        console.log('deleteOne: /users/', ID, 'deleted ', deleteCount, ' entries')
        return res.status(200).end();
    } catch (error) {
        console.error(error);
        return res.status(500).json(error);
    }
}


const express = require('express');
const router = express.Router()

router.route('/')
    .get(getAll);

router.route('/:id')
    .get(getOne)
    .put(updateOne)
    .delete(deleteOne);


export default router;