import { NextFunction } from "express";
import User from "../models/users";

export async function getUserIdByEmail(email: string) {
    const user = await User.findOne({
        where: {
            email: email
        }
    })

    if (!user) {
        throw new Error(`Can't get userId. User ${email} not found`);
    }

    console.debug(user);
    return user.get('id');
}
