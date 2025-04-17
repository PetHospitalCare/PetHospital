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
const fs = require('fs');

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
// const distPath = path.join(__dirname, "../ph_fe/dist");
// if (fs.existsSync(distPath)) {
//     app.use(express.static(distPath));
//     app.get("*", (req, res) => {
//         const indexPath = path.join(distPath, "index.html");
//         if (fs.existsSync(indexPath)) {
//             res.sendFile(indexPath);
//         } else {
//             res.status(404).send("Frontend not built yet");
//         }
//     });
// } else {
//     console.log("Warning: Frontend dist directory not found");
// }
// Kiểm tra cấu trúc thư mục
console.log('===== PROJECT STRUCTURE =====');
console.log('Current directory:', __dirname);
console.log('Parent directory:', path.resolve(__dirname, '..'));

// Kiểm tra thư mục frontend
const frontendPath = path.resolve(__dirname, '../ph_fe');
console.log('\nFrontend directory exists:', fs.existsSync(frontendPath));
if (fs.existsSync(frontendPath)) {
    console.log('Frontend directory contents:', fs.readdirSync(frontendPath));
}

// Kiểm tra thư mục dist
const distPath = path.resolve(__dirname, '../ph_fe/dist');
console.log('\nDist directory exists:', fs.existsSync(distPath));
if (fs.existsSync(distPath)) {
    console.log('Dist directory contents:', fs.readdirSync(distPath));

    // Kiểm tra file index.html
    const indexPath = path.join(distPath, 'index.html');
    console.log('\nindex.html exists:', fs.existsSync(indexPath));
}

// Kiểm tra đường dẫn tuyệt đối trên Render
const renderProjectPath = '/opt/render/project/src';
if (fs.existsSync(renderProjectPath)) {
    console.log('\nRender project directory exists and contains:', fs.readdirSync(renderProjectPath));

    const renderFrontendPath = path.join(renderProjectPath, 'ph_fe');
    if (fs.existsSync(renderFrontendPath)) {
        console.log('\nRender frontend directory exists and contains:', fs.readdirSync(renderFrontendPath));

        const renderDistPath = path.join(renderFrontendPath, 'dist');
        if (fs.existsSync(renderDistPath)) {
            console.log('\nRender dist directory exists and contains:', fs.readdirSync(renderDistPath));
        } else {
            console.log('\nRender dist directory does not exist at:', renderDistPath);
        }
    }
}

console.log('===== END PROJECT STRUCTURE =====');
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

