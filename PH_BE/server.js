require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const db = require("./models");
const { createServer } = require("node:http");
const { Server } = require("socket.io");
const http = require("http");

const { ProductRouter, CategoryRouter, ServiceRouter, AccountRouter, PetRecordRouter, BookingRouter, MedicineRouter, PetRouter, ShoppingCartRouter, NewRouter } = require("./routes");


//khoi tao web server

const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: process.env.FRONT_END_URL,
    },
});
app.use(
    cors({
        origin: true,
        credentials: true,
    })
);
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());
app.use(bodyParser.json({ limit: "64mb" }));
app.use(bodyParser.urlencoded({ limit: "64mb", extended: true }));
// Define route dưới đây //
app.get("/test", async (req, res) => {
    return res.json({ message: "hello world" });
})
app.use("/product", ProductRouter);
app.use("/category", CategoryRouter);
app.use("/service", ServiceRouter);
app.use("/account", AccountRouter);
app.use("/medicine", MedicineRouter);
app.use("/pet-record", PetRecordRouter);
app.use("/booking", BookingRouter);
app.use("/pet", PetRouter);
app.use("/shopping-cart", ShoppingCartRouter);
app.use("/new", NewRouter);

io.on("connection", (socket) => {
    console.log("An user connect: ", socket.id);

    socket.on("disconnect", () => {
        console.log("🔥: A user disconnected");
    });
});

exports.io = io;

server.listen(process.env.PORT || 9999, process.env.HOST_NAME || "localhost", () => {
    console.log(`Server in running at: http://${process.env.HOST_NAME}:${process.env.PORT}`);
    db.connect();
});
