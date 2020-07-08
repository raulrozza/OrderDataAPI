import Order from '../models/Order';
import { RequestHandler } from 'express';

const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
];

export const index: RequestHandler = async (_, res) => {
    const currentYear = new Date();

    currentYear.setFullYear(currentYear.getFullYear());

    const pastYear = new Date();

    pastYear.setFullYear(pastYear.getFullYear() - 1);
    pastYear.setMonth(currentYear.getMonth() + 1);
    pastYear.setDate(1);

    try {
        const orderResponse = await Order.aggregate([
            {
                $match: {
                    ordered_on: {
                        $gte: pastYear,
                        $lt: currentYear,
                    },
                    status: 'Delivered',
                },
            },
            {
                $group: {
                    _id: { month: { $month: '$ordered_on' } },
                    bruteTotal: { $sum: '$total' },
                },
            },
            {
                $sort: {
                    _id: 1,
                },
            },
            {
                $project: {
                    _id: 0,
                    date: '$_id',
                    bruteTotal: 1,
                    count: 1,
                },
            },
        ]);

        const labels = orderResponse.map(
            month => monthNames[month.date.month - 1],
        );

        const bruteAmount = orderResponse.map(value => value.bruteTotal);

        labels.forEach((l, i) => {
            const monthIndex = monthNames.indexOf(l);

            if (labels[i + 1] !== monthNames[monthIndex + 1]) {
                labels.splice(i + 1, 0, monthNames[monthIndex + 1]);
                bruteAmount.splice(i + 1, 0, 0);
            }
        });

        return res.json({
            labels,
            data: [bruteAmount],
        });
    } catch (message) {
        return res.status(400).send({ message: String(message) });
    }
};
