const dotenv = require('dotenv');
dotenv.config();
module.exports = {
    port: process.env.PORT,
    SECRET_KEY: process.env.SECRET_KEY,
    MONGO_URL: process.env.MONGO_URL,
    CORS_CONFIG: process.env.CORS_CONFIG,
    NAME: process.env.NAME,
    USERNAME: process.env.USERNAME,
    PASSWORD: process.env.PASSWORD,
    GEOCODE_KEY: process.env.GEOCODE_KEY,
};
