/* eslint-disable camelcase */
import Order from '../models/Order';
import NodeGeocoder from 'node-geocoder';
import { RequestHandler } from 'express';
import { Error } from 'mongoose';

const ITEMS_PER_PAGE = 30;

interface FilterQuery {
    status?: string;
    payment_type?: string;
    ordered_on?: object;
    name?: object;
}

interface IndexQueryParams {
    names?: string[];
    dateBegin?: string;
    dateEnd?: string;
    orderStatus?: string;
    paymentType?: string;
    product?: string[];
    page?: number;
}

export const index: RequestHandler = async (req, res) => {
    const {
        names,
        dateBegin,
        dateEnd,
        orderStatus,
        paymentType,
        product,
        page = 1,
    }: IndexQueryParams = req.query;

    const SKIPPED_ITEMS = ITEMS_PER_PAGE * (page - 1);

    // make header visible to frontend

    res.set('Access-Control-Expose-Headers', 'X-Total-Count');

    try {
        let query: FilterQuery = {};

        // Check the queries

        if (orderStatus) query.status = orderStatus;

        if (paymentType) query.payment_type = paymentType;

        if (dateBegin || dateEnd) {
            if (dateBegin && dateEnd)
                query.ordered_on = {
                    $gte: new Date(dateBegin),
                    $lt: new Date(dateEnd),
                };
            else if (dateBegin)
                query.ordered_on = { $gte: new Date(dateBegin) };
            else if (dateEnd) query.ordered_on = { $lte: new Date(dateEnd) };
        }

        if (names) {
            const regex: string[] = [];

            // Build the regex for use in the aggregate

            names.forEach(() => regex.push(`(${names.join('|')})`));

            query.name = { $regex: regex.join('.'), $options: 'i' };
        }

        if (product) {
            const regex = [];

            // Build the regex for use in the aggregate

            product.forEach(() => regex.push(`(${product.join('|')})`));

            query = Object.assign(query, {
                'contents.name': {
                    $regex: product.join('.'),
                    $options: 'i',
                },
            });
        }

        const result = await Order.aggregate([
            // pipeline array

            {
                $project: {
                    _id: 1,
                    status: 1,
                    ordered_on: 1,
                    total: 1,
                    shipping: 1,
                    'customer.firstname': 1,
                    'customer.lastname': 1,
                    name: {
                        $concat: [
                            '$customer.firstname',
                            ' ',
                            '$customer.lastname',
                        ],
                    },
                    'ship.address1': 1,
                    payment_type: 1,
                    'contents.name': 1,
                },
            }, // first stage: project
            { $match: query }, // second stage: filter
        ])
            .sort({ ordered_on: -1 })
            .skip(SKIPPED_ITEMS)
            .limit(ITEMS_PER_PAGE);

        if (result.length <= 0) {
            res.header('X-Total-Count', '1');

            return res.json(result);
        } else {
            result.forEach(element => {
                delete element.customer;
                delete element.contents;
            });

            const [{ documentCount }] = await Order.aggregate([
                {
                    $project: {
                        _id: 0,
                        status: 1,
                        ordered_on: 1,
                        'customer.firstname': 1,
                        'customer.lastname': 1,
                        name: {
                            $concat: [
                                '$customer.firstname',
                                ' ',
                                '$customer.lastname',
                            ],
                        },
                        payment_type: 1,
                        'contents.name': 1,
                    },
                },
                { $match: query },
                { $count: 'documentCount' },
            ]);

            const pageCount = Math.ceil(documentCount / ITEMS_PER_PAGE);

            res.header('X-Total-Count', String(pageCount));

            return res.json(result);
        }
    } catch (message) {
        return res.status(400).json({ emessage: String(message) });
    }
};

export const show: RequestHandler = async (req, res) => {
    const { id, map } = req.query;

    try {
        const result = await Order.findById(id)
            .then(order => order)
            .catch(error => {
                throw error;
            });

        if (!result) throw new Error('Order not found!');

        // When there's a call from the map page, the order should return it's location as well. If it still has none stored,
        // then one is generated

        if (map) {
            if (!result.ship.location) {
                const { GEOCODE_KEY } = require('../../config');

                const geocoder = NodeGeocoder({
                    provider: 'google',
                    httpAdapter: 'https',
                    apiKey: GEOCODE_KEY,
                    formatter: null,
                });

                const [response] = await geocoder
                    .geocode({
                        address: `${result.ship.address1} ${result.ship.address2}`,
                        country: result.ship.country,
                        zipcode: result.ship.zip,
                    })
                    .catch(error => {
                        throw error;
                    });

                const location = {
                    lat: response.latitude || 0,
                    lng: response.longitude || 0,
                };

                await Order.updateOne(
                    {
                        _id: result._id,
                    },
                    {
                        $set: {
                            'ship.location': location,
                        },
                    },
                ).catch(error => {
                    throw error;
                });

                result.ship.location = location;
            }
        }

        return res.json(result);
    } catch (message) {
        return res.status(400).json({ message: String(message) });
    }
};
