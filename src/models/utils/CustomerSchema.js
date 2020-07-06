const { Schema } = require('mongoose');

const CustomerSchema = new Schema(
    {
        firstname: String,
        lastname: String,
        email: String,
        newsletter_subscription: Boolean,
        phone: String,
        company: String,
        sex: Boolean,
        cpf: String,
        birthday: String,
    },
    {
        _id: false,
    },
);

module.exports = CustomerSchema;
