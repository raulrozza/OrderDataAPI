const { Schema, model } = require('mongoose');
const CustomerSchema = require('./utils/CustomerSchema');
const ShipSchema = require('./utils/ShipSchema');
const OrderContentSchema = require('./utils/OrderContentSchema');

const OrderSchema = new Schema(
    {
        status: String,
        ordered_on: Date,
        shipped_on: String,
        total: Number,
        payment_info: String,
        payment_type: String,
        delivered_on: String,
        customer: CustomerSchema,
        ship: ShipSchema,
        contents: [OrderContentSchema],
    },
    {},
);

module.exports = model('Order', OrderSchema);
