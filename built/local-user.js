"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAll = exports.createOne = void 0;
const users_1 = require("./models/users");
async function createOne(req, res, next) {
    console.log('createOne: [POST] /users/');
    try {
        const USER_MODEL = {
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
        };
        try {
            const user = await users_1.default.create(USER_MODEL);
            console.log('OK createOne USER: ', user);
            return res.status(201).json(user);
        }
        catch (error) {
            console.error('ERROR in createOne ', error);
            return res.status(500).json(error);
        }
    }
    catch (error) {
        return res.status(400).json('Bad Request');
    }
}
exports.createOne = createOne;
async function getAll(req, res, next) {
    console.log('getAll: [GET] /users/');
    try {
        const ALL = await users_1.default.findAll();
        console.log('OK getAll USER: ', ALL.map((el) => el.dataValues));
        return res.status(200).json(ALL);
    }
    catch (error) {
        console.error('getAll USER', error);
        return res.status(500).json(error);
    }
}
exports.getAll = getAll;
//# sourceMappingURL=local-user.js.map