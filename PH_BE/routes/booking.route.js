const express = require("express");
const { BookingController } = require('../controllers');
const { verifyToken, authorize } = require("../middlewares/auth");

const BookingRouter = express.Router();

BookingRouter.post("/create", BookingController.CreateNewBooking);
BookingRouter.get("/get-all", verifyToken, BookingController.GetAllBooking);
BookingRouter.put("/assigndoctor/:id", verifyToken, authorize("staff", "admin"), BookingController.AssignDoctor);
BookingRouter.put("/update/:id", verifyToken, authorize("staff", "admin"), BookingController.UpdateBooking);

BookingRouter.get("/get-by-id/:id", BookingController.getBookingbyId);

BookingRouter.get("/get-booking-by-user", verifyToken, BookingController.getBookingByUser);
BookingRouter.get("/cancel/:id", verifyToken, BookingController.CancelBookingById);
BookingRouter.get("/get-by-status/:status", verifyToken, BookingController.GetAllBookingByStatus);
BookingRouter.get("/createpayment/:booking_id", verifyToken, authorize("staff", "admin"), BookingController.CreatePaymentBooking);
BookingRouter.post("/receivehook", BookingController.receivehook);
BookingRouter.get("/pay-by-cash/:id", BookingController.UpdateBookingPaymentCash);
BookingRouter.get("/get-all-view", BookingController.GetAllBookingByStaffandAdmin);
module.exports = BookingRouter;