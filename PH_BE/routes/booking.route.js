const express = require("express");
const { BookingController } = require('../controllers');
const { verifyToken } = require("../middlewares/auth");

const BookingRouter = express.Router();

BookingRouter.post("/create", BookingController.CreateNewBooking);
BookingRouter.get("/get-all", BookingController.GetAllBooking);
BookingRouter.put("/assigndoctor/:id", BookingController.AssignDoctor);
BookingRouter.put("/update/:id", BookingController.UpdateBooking);

BookingRouter.get("/get-by-id/:id", BookingController.getBookingbyId);

BookingRouter.get("/get-booking-by-user",verifyToken, BookingController.getBookingByUser);

module.exports = BookingRouter;