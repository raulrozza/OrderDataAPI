const Order = require('../models/Order');

// This controller is responsible for returning the last 10 (or as requested) orders

module.exports = {
    // Returns the last orders

    async index(req, res) {
        let limit = req.query.limit || 10;

        try {
            let result = await Order.find(
                {},
                {
                    _id: 1,
                    ordered_on: 1,
                    total: 1,
                    customer: 1,
                },
            )
                .sort({ ordered_on: -1 })
                .limit(parseInt(limit))
                .catch(error => {
                    throw error;
                });

            return res.send(result);
        } catch (message) {
            return res.status(400).json({ message: String(message) });
        }
    },
};
