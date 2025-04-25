require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const db = require("./models");

const { createServer } = require("node:http");
const { Server } = require("socket.io");
const http = require("http");
const { initScheduledTasks } = require("./utils/scheduledTask");
const path = require("path");
const { fileURLToPath } = require("url");



const { ProductRouter, CategoryRouter, ServiceRouter, AccountRouter, PetRecordRouter, BookingRouter, MedicineRouter, PetRouter, ShoppingCartRouter, MedicalRoute, NewRouter, PaymentRouter
    , DashboardRouter, MessageRoute, NotificationRoute
} = require("./routes");



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
        origin: process.env.FRONT_END_URL,
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
app.use("/medical", MedicalRoute);
app.use("/pet", PetRouter);
app.use("/shopping-cart", ShoppingCartRouter);
app.use("/new", NewRouter);
app.use("/payment", PaymentRouter);
app.use("/dashboard", DashboardRouter)
app.use("/message", MessageRoute)
app.use("/notification", NotificationRoute)

exports.io = io;
require("./sockets")(io);
app.use(express.static(path.join(__dirname, `../ph_fe/dist`)));
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, `../ph_fe/dist/index.html`));
});
// Kết nối database
db.connect().then(() => {
    // Khởi động scheduled tasks sau khi kết nối DB thành công
    initScheduledTasks();
}).catch(err => {
    console.error("❌ Lỗi kết nối database:", err);
});
// Lắng nghe trên cổng Render cung cấp
const port = process.env.PORT || 9999;
server.listen(port, () => {
    console.log(`✅ Server is running on port: ${port}`);
});

