
import { NextFunction, Router } from 'express'
import { authenticateToken } from '../util/auth';
import User from '../models/users'
import { getUserIdByEmail } from '../util/common';
import Quotes from '../models/quotes';
import { idText } from 'typescript';

const router = Router();

router.use(async (req: any, res: any, next: NextFunction) => {
    console.debug('retrieving use data');
    const user = await User.findOne({
        where: {
            email: req.user.email
        },
        attributes: {
            exclude: ['password']
        }
    })

    if (!req.user) {
        console.log(`user ${req.user.email} not found.`)
        return res.status(400).json({ error: 'user not found.' });
    }

    req.user = user;
    next();
})

router.route('/')
    .get(async (req: any, res: any, next: NextFunction) => {
        console.debug('[GET] /me')
        return res.status(200).json(req.user);
    })

router.post('/myquote', async (req: any, res: any, next: NextFunction) => {
    console.log('add quote')
    const USER_ID = req.user.id;
    console.log('createOne QUOTES', `user: ${USER_ID}`);

    try {
        const QUOTE = await Quotes.create({ userId: USER_ID, text: req.body.text })
        console.log('createOne QUOTES', 'OK', QUOTE.dataValues)
        return res.status(200).json(QUOTE);
    } catch (error) {
        return res.status(400).json(error);
    }
})

router.put('/myquote/:id', async (req: any, res: any, next: NextFunction) => {
    console.log('update quote', req.params.id);

    try {
        let quote = await Quotes.findByPk(req.params.id)

        if (!quote) {
            console.log(`quote with id: ${req.params.id} not found`)
            return res.sendStatus(404);
        }

        if (+quote.userId !== +req.user.id) {
            console.log(`user id mismatch ! ${quote.userId} : ${req.user.id}`)
            return res.sendStatus(400);
        }

        quote.set('text', req.body.text)
        quote = await quote.save();

        return res.status(200).json(quote);
    } catch (error) {
        console.log('error updating quote', error);
        return res.sendStatus(500).json(error)
    }
})


export default router;