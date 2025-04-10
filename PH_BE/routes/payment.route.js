const express = require('express');
const { PaymentController } = require('../controllers');
const paymentRoute = express.Router();

paymentRoute.post("/update-payment", PaymentController.updatePayment);
paymentRoute.post("/vnpay:userId", PaymentController.paymentVNPay);
paymentRoute.get("/get-payments:userId", PaymentController.getPaymentsByUserId);
paymentRoute.post("/cod/pay:userId", PaymentController.paymentCodPay);
paymentRoute.get("/get-all-payments", PaymentController.getAllPayments);
paymentRoute.post("/cancel-order:paymentId", PaymentController.cancelOrder);

module.exports = paymentRoute;