const cron = require('node-cron');

// Services
const getOrders = require('./getOrders');

//models
const Order = require('../models/Order');

const getDate = () => {
    const date = new Date();

    return `[${date.getUTCHours()}:${date.getUTCMinutes()}:${date.getUTCSeconds()}]`;
};

// Scheduled method to fill the database
module.exports = () => {
    cron.schedule(
        '14 * * * *',
        async () => {
            console.log(`${getDate()} Starting daily update...`);

            const orders = await getOrders();
            orders.forEach(async order => {
                await Order.findOneAndUpdate({ number: order.number }, order, {
                    upsert: true,
                }).catch(error => console.error(error));
            });
            console.log(`${getDate()} Orders updated.`);
        },
        {
            scheduled: true,
            timezone: 'America/Sao_Paulo',
        },
    );
};
