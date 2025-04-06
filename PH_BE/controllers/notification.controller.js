const db = require("../models");
const Notification = db.notification;

// Get all notifications for a user
const GetUserNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({
        })
            .sort({ createdAt: -1 })
        return res.status(200).json(notifications);
    } catch (error) {
        console.error("Error fetching notifications:", error);
        return res.status(500).json({ message: "Lỗi server khi lấy thông báo", error });
    }
};

// Mark notifications as read
const MarkNotificationsAsRead = async (req, res) => {
    try {


        // Otherwise mark all as read
        await Notification.updateMany(
            { $set: { isRead: true } }
        );

        return res.status(200).json({ success: true, message: "Đã đánh dấu đã đọc thành công" });
    } catch (error) {
        console.error("Error marking notifications as read:", error);
        return res.status(500).json({ message: "Lỗi server khi cập nhật thông báo", error });
    }
};

// Create a helper function to add a notification (for internal use)
const createNotification = async (recipientId, type, content, relatedId, refModel) => {
    try {
        // Set expiration to 48 hours from now
        const expireAt = new Date();
        expireAt.setHours(expireAt.getHours() + 48);

        const notification = new Notification({
            recipient: recipientId,
            type,
            content,
            relatedId,
            refModel,
            isRead: false,
            expireAt
        });

        await notification.save();

        // Return the notification object for socket emission
        return notification;
    } catch (error) {
        console.error("Error creating notification:", error);
        return null;
    }
};


module.exports = {
    GetUserNotifications,
    MarkNotificationsAsRead,
    createNotification
};