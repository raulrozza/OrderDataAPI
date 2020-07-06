const { Schema } = require('mongoose');

const LocationSchema = new Schema(
    {
        lat: Number,
        lng: Number,
    },
    {
        _id: false,
    },
);

module.exports = LocationSchema;
