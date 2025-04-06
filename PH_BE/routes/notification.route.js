const express = require('express');
const { NotificationController } = require('../controllers');
const notificationRoute = express.Router();

notificationRoute.get("/get-all", NotificationController.GetUserNotifications);
notificationRoute.put("/mark-as-read", NotificationController.MarkNotificationsAsRead);
notificationRoute.get("/test", async (req, res) => {
    return res.json({ message: "hello world" });
});
module.exports = notificationRoute;