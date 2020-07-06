const express = require('express');

const mongoose = require('mongoose');

const cors = require('cors');

// Services

const scheduler = require('./services/scheduler');

// Server's functions

const routes = require('./routes.js');

// Environment variables

const { port, MONGO_URL, CORS_CONFIG } = require('../config');

// Initial server configuration

const server = express();

// Try to connect with mongo and set up the server.

mongoose
    .connect(MONGO_URL, {
        useUnifiedTopology: true,

        useNewUrlParser: true,

        useFindAndModify: false,
    })

    .catch(error => console.error('MongoDB error:', error));

const connection = mongoose.connection;

connection.on('error', () => {
    console.error('There was an error.');
});

connection.on('disconnect', () => {
    mongoose
        .connect(MONGO_URL, {
            useUnifiedTopology: true,

            useNewUrlParser: true,

            useFindAndModify: false,
        })

        .catch(error => console.error('MongoDB error:', error));
});

if (CORS_CONFIG) {
    const whitelist = [CORS_CONFIG];

    const corsOptionsDelegate = (req, callback) => {
        let corsOptions;

        if (whitelist.indexOf(req.header('Origin')) !== -1)
            corsOptions = { origin: true };
        // reflect (enable) the requested origin in the CORS response
        else corsOptions = { origin: false }; // disable CORS for this request

        callback(null, corsOptions); // callback expects two parameters: error and options
    };

    server.use(cors(corsOptionsDelegate));
} else server.use(cors());

server.use(express.json());

server.use(routes);

scheduler();

server.listen(port, () =>
    console.log(`Server and Updater started on port ${port}`),
);
