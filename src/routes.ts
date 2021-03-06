import express from 'express';
import verifyToken from './verifyToken';

// Controllers
import * as AuthenticationController from './controllers/AuthenticationController';
import * as LastOrdersController from './controllers/LastOrdersController';
import * as MonthlyProfitController from './controllers/MonthlyProfitController';
import * as OrderController from './controllers/OrderController';
import * as UserController from './controllers/UserController';

const routes = express.Router();

// Authentication
routes.post('/login', AuthenticationController.store);

// Orders
routes.get('/orders?:page', verifyToken, OrderController.index);
routes.get('/order?:id', verifyToken, OrderController.show);

// User
routes.post('/user', UserController.store);
routes.put('/user', verifyToken, UserController.update);

// Reports
routes.get('/lastOrders', verifyToken, LastOrdersController.index);
routes.get('/monthlyProfit', verifyToken, MonthlyProfitController.index);

export default routes;
