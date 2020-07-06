const { Schema } = require('mongoose');

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

module.exports = OrderContentSchema;
