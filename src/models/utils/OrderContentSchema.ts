import { Schema } from 'mongoose';

const OrderContentSchema = new Schema(
    {
        name: String,
        price: String,
        image: String,
        quantity: Number,
    },
    {
        _id: false,
    },
);

export default OrderContentSchema;
