const express = require("express");
const { BookingController } = require('../controllers');
const { verifyToken } = require("../middlewares/auth");

const BookingRouter = express.Router();

BookingRouter.post("/create", BookingController.CreateNewBooking);
BookingRouter.get("/get-all", verifyToken, BookingController.GetAllBooking);
BookingRouter.put("/assigndoctor/:id", BookingController.AssignDoctor);
BookingRouter.put("/update/:id", BookingController.UpdateBooking);

BookingRouter.get("/get-by-id/:id", BookingController.getBookingbyId);

BookingRouter.get("/get-booking-by-user", verifyToken, BookingController.getBookingByUser);
BookingRouter.get("/cancel/:id", BookingController.CancelBookingById);
BookingRouter.get("/get-by-status/:status", BookingController.GetAllBookingByStatus);
BookingRouter.get("/createpayment/:booking_id", BookingController.CreatePaymentBooking);
BookingRouter.post("/receivehook", BookingController.receivehook);
BookingRouter.get("/pay-by-cash/:id", BookingController.UpdateBookingPaymentCash);
BookingRouter.get("/get-all-view", BookingController.GetAllBookingByStaffandAdmin);
module.exports = BookingRouter;