import Order from '../models/Order';
import { RequestHandler } from 'express';

// This controller is responsible for returning the last 10 (or as requested) orders

export const index: RequestHandler = async (req, res) => {
    const limit = (req.query.limit || 10) as number;

    try {
        const result = await Order.find(
            {},
            {
                _id: 1,
                ordered_on: 1,
                total: 1,
                customer: 1,
            },
        )
            .sort({ ordered_on: -1 })
            .limit(limit)
            .catch(error => {
                throw error;
            });

        return res.send(result);
    } catch (message) {
        return res.status(400).json({ message: String(message) });
    }
};
