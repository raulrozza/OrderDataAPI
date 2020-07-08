/* eslint-disable camelcase */
import { Schema, model, Document } from 'mongoose';
import CustomerSchema from './utils/CustomerSchema';
import ShipSchema from './utils/ShipSchema';
import OrderContentSchema from './utils/OrderContentSchema';

interface IOrderContent {
    name: string;
    price: number;
    image: string;
    quantity: number;
}

export interface IOrder extends Document {
    status: string;
    ordered_on: string;
    shipped_on: string;
    number: number;
    total: number;
    payment_info: string;
    payment_type: string;
    delivered_on: string;
    customer: {
        firstname: string;
        lastname: string;
        email: string;
        newsletter_subscription: boolean;
        phone: string;
        company: string;
        sex: number;
        cpf: string;
        birthday: string;
    };
    ship: {
        address1: string;
        address2: string;
        apartment_number: string;
        district: string;
        city: string;
        zip: string;
        zone: string;
        country: string;
        location: {
            lat: number;
            lng: number;
        };
    };
    contents: IOrderContent[];
}

const OrderSchema = new Schema(
    {
        status: String,
        ordered_on: Date,
        shipped_on: String,
        total: Number,
        number: Number,
        payment_info: String,
        payment_type: String,
        delivered_on: String,
        customer: CustomerSchema,
        ship: ShipSchema,
        contents: [OrderContentSchema],
    },
    {},
);

export default model<IOrder>('Order', OrderSchema);
