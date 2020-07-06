const orderData = require('../data/order.json');

module.exports = async () => {
    try {
        const data = JSON.parse(orderData);

        return data;
    } catch (error) {
        console.error(error);
        return [];
    }
};
