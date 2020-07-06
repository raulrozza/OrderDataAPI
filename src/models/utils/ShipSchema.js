const { Schema } = require('mongoose');

const LocationSchema = require('./LocationSchema');

const ShipSchema = new Schema(
    {
        address1: String,
        address2: String,
        apartment_number: String,
        district: String,
        city: String,
        zip: String,
        zone: String,
        country: String,
        location: LocationSchema,
    },
    {
        _id: false,
    },
);

module.exports = ShipSchema;
