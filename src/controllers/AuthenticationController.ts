import User from '../models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { SECRET_KEY } from '../../config';
import { RequestHandler } from 'express';
const VALID_DAYS = 14;

/*
    The Authentication Controllers is responsible for the authentication methods. It's operations consists in returning the user trying to
    login, and also creating a login session in assossiation with an user
*/

// Create a user's session

export const store: RequestHandler = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username })
            .then(user => user)
            .catch(error => {
                throw error;
            });

        if (!user)
            return res
                .status(400)
                .json({ error: 2, message: 'User not found!' });
        else {
            // bcrypt compares hashed password with inserted password

            const passwordMatch = await bcrypt
                .compare(password, user.password)
                .catch(error => {
                    throw error;
                });

            if (passwordMatch) {
                // Token expires in {VALID_DAYS} days. ExpiresIn takes on a number of seconds, so 60*60*24*VALID_DAYS

                const token = jwt.sign(
                    { username, id: user._id },
                    SECRET_KEY || '',
                    {
                        expiresIn: VALID_DAYS * 86400,
                    },
                );

                if (!token)
                    return res
                        .status(400)
                        .json({ error: 1, message: 'Token not created' });

                await User.updateOne(
                    {
                        _id: user._id,
                    },
                    {
                        $set: {
                            token,
                        },
                    },
                ).catch(error => {
                    throw error;
                });

                user.token = token;

                return res.json({ user, token: user.token });
            } else
                return res
                    .status(400)
                    .json({ error: 3, message: 'Incorrect password' });
        }
    } catch (message) {
        return res.status(400).json({ error: -1, message: String(message) });
    }
};
