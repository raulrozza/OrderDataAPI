import { Schema } from 'mongoose';

const LocationSchema = new Schema(
    {
        lat: Number,
        lng: Number,
    },
    {
        _id: false,
    },
);

export default LocationSchema;
