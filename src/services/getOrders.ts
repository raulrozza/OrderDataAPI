import orderData from '../data/order.json';
import { IOrder } from '../models/Order';

const getOrders = async () => {
    return orderData as IOrder[];
};

export default getOrders;
