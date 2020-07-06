const express = require('express');
const verifyToken = require('./verifyToken.js');

// Controllers
const AuthenticationController = require('./controllers/AuthenticationController');
const LastOrdersController = require('./controllers/LastOrdersController');
const MonthlyProfitController = require('./controllers/MonthlyProfitController');
const OrderController = require('./controllers/OrderController');
const UserController = require('./controllers/UserController');

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

module.exports = routes;
