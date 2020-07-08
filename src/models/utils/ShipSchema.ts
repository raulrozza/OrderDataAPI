import { Schema } from 'mongoose';

import LocationSchema from './LocationSchema';

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

export default ShipSchema;
