const express = require("express");
const { BookingController } = require('../controllers');

const BookingRouter = express.Router();

BookingRouter.post("/create", BookingController.CreateNewBooking);

module.exports = BookingRouter;