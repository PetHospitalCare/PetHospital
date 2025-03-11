const mongoose = require("mongoose");
const Product = require("./product.model");
const Category = require("./category.model");
const Service = require("./service.model");
const Account = require("./account.model");
const OTP = require("./otp.model");
const Pet = require("./pet.model");

const Booking = require("./booking.model");

const Medicine = require("./medicine.model");


mongoose.Promise = global.Promise;

const db = {};
db.product = Product
db.service = Service
db.category = Category
db.account = Account
db.otp = OTP
db.pet = Pet
db.booking = Booking
db.medicine = Medicine


const connectDB = async () => {
    await mongoose
        .connect(process.env.MONGO_URI, {
            dbName: process.env.DB_NAME,
        })
        .then(() => console.log("Connected to Mongodb"))
        .catch((error) => {
            console.log(error.message);
            process.exit();
        });
};

db.connect = connectDB;

module.exports = db;
