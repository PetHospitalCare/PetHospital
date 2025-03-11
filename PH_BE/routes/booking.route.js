const express = require("express");
const { BookingController } = require('../controllers');

const BookingRouter = express.Router();

BookingRouter.post("/create", BookingController.CreateNewBooking);
BookingRouter.get("/get-all", BookingController.GetAllBooking);
BookingRouter.put("/assigndoctor/:id", BookingController.AssignDoctor);
BookingRouter.put("/update/:id", BookingController.UpdateBooking);
module.exports = BookingRouter;