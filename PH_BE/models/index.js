const mongoose = require("mongoose");
const Product = require("./product.model");
const Category = require("./category.model");
const Service = require("./service.model");
mongoose.Promise = global.Promise;

const db = {};
db.product = Product
db.service = Service
db.category = Category

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
