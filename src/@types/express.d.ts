// This file alters the default Express's Request type, adding the auth field used on token verification

declare namespace Express {
    export interface Request {
        auth?: {
            username: string;
            id: string;
            iat: number;
            exp: number;
        };
    }
}
