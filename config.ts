import dotenv from 'dotenv';
dotenv.config();

export const port = process.env.PORT;
export const SECRET_KEY = process.env.SECRET_KEY;
export const MONGO_URL = process.env.MONGO_URL;
export const CORS_CONFIG = process.env.CORS_CONFIG;
export const NAME = process.env.NAME;
export const USERNAME = process.env.USERNAME;
export const PASSWORD = process.env.PASSWORD;
export const GEOCODE_KEY = process.env.GEOCODE_KEY;
