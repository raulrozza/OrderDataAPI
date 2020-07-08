import cron from 'node-cron';

// Services
import getOrders from './getOrders';

// models
import Order from '../models/Order';

const getDate = () => {
    const date = new Date();

    return `[${date.getUTCHours()}:${date.getUTCMinutes()}:${date.getUTCSeconds()}]`;
};

// Scheduled method to fill the database
const scheduler = () => {
    cron.schedule(
        '38 * * * *',
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

export default scheduler;
