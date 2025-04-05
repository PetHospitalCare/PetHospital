const express = require('express');
const { PaymentController } = require('../controllers');
const paymentRoute = express.Router();

paymentRoute.post("/update-payment", PaymentController.updatePayment);
paymentRoute.post("/vnpay:userId", PaymentController.paymentVNPay);
paymentRoute.get("/get-payments:userId", PaymentController.getPaymentsByUserId);
module.exports = paymentRoute;