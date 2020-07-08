import jwt from 'jsonwebtoken';
import { RequestHandler } from 'express';
import { SECRET_KEY } from '../config';

// TOKEN FORMAT
// Authorization: Bearer <access_token>
// Token Verification

interface Auth {
    username: string;
    id: string;
    iat: number;
    exp: number;
}

const verifyToken: RequestHandler = (req, res, next) => {
    const bearerHeader = req.headers.authorization;

    if (typeof bearerHeader !== 'undefined') {
        // Splits token on space due to its format
        const bearer = bearerHeader.split(' ');

        // Gets token from the array
        const bearerToken = bearer[1];

        jwt.verify(bearerToken, SECRET_KEY || '', async (error, auth) => {
            if (error) res.status(403).send({ error: 'Invalid token.' });
            else {
                req.auth = auth as Auth;

                // Next Middleware
                next();
            }
        });
    } else {
        // Access Forbidden
        res.status(403).send({ error: 'Could Not Verify Token...' });
    }
};

export default verifyToken;
