const db = require("../models");
const Message = db.message;
const Conversation = db.conversation;
const Notification = db.notification;
module.exports = (io) => {
    io.on("connection", (socket) => {
        console.log("New connection:", socket.id);

        // Keep track of staff members and which conversations they're viewing
        const staffRooms = new Map();

        socket.on("join-conversation", async (conversationId) => {
            socket.join(`conversation_${conversationId}`);
            console.log(`User joined conversation ${conversationId}`);

            // Store the current conversation for this staff member
            if (socket.staffId) {
                staffRooms.set(socket.staffId, conversationId);

                // Mark conversation as read when staff joins
                await Conversation.findByIdAndUpdate(
                    conversationId,
                    { unread: false }
                );

                // Emit updated conversation status to all staff
                io.emit('conversation-status-update', {
                    conversationId,
                    unread: false
                });
            }
        });

        // Staff member identifies themselves
        socket.on("staff-login", (staffId) => {
            socket.staffId = staffId;
            console.log(`Staff ${staffId} logged in with socket ${socket.id}`);

            // Join a staff-specific room for targeted notifications
            socket.join(`staff_${staffId}`);
        });

        socket.on("send-message", async (data) => {
            try {
                const message = new Message(data);
                await message.save();

                // Send the message to all clients in the conversation room
                io.to(`conversation_${data.conversationId}`).emit("new-message", message);

                // Get the conversation details
                const conversation = await Conversation.findById(data.conversationId)
                    .populate('customerId')

                console.log("Conversation details:", conversation);
                // Check if this is a customer message
                const isCustomerMessage = data.sender.toString() === conversation.customerId._id.toString();
                if (isCustomerMessage) {
                    const messageCount = await Message.countDocuments({
                        conversationId: data.conversationId
                    });

                    if (messageCount <= 1) {
                        // Gửi thông báo về cuộc hội thoại mới cho tất cả nhân viên
                        io.emit('new-conversation', conversation);
                    }
                    // Mark conversation as unread
                    await Conversation.findByIdAndUpdate(
                        data.conversationId,
                        { unread: true }
                    );


                    // Notify all staff members about the new message
                    const notificationData = {
                        conversationId: data.conversationId,
                        message: message.content,
                        customerName: conversation.customerId.username,
                        timestamp: new Date(),
                        unread: true
                    };

                    // Broadcast to all connected staff members except those viewing this conversation
                    conversation.staffParticipants.forEach(staff => {
                        const staffId = staff._id.toString();
                        const currentConversation = staffRooms.get(staffId);

                        // Only send notification if staff isn't currently viewing this conversation
                        if (currentConversation !== data.conversationId) {
                            io.to(`staff_${staffId}`).emit('new-message-notification', notificationData);
                        }
                    });

                    // Update all staff about conversation status change
                    io.emit('conversation-status-update', {
                        conversationId: data.conversationId,
                        unread: true,
                        lastMessage: message.content,
                        timestamp: new Date()
                    });
                    const notification = new Notification({
                        type: "message",
                        content: `${conversation.customerId.username} đã gửi cho bạn 1 tin nhắn mới!`,
                        isRead: false,
                    })
                    await notification.save();
                    io.emit('new-notification', notification);

                }
            } catch (error) {
                console.error("Error sending message:", error);
            }
        });

        socket.on("mark-as-read", async (conversationId) => {
            try {
                await Conversation.findByIdAndUpdate(
                    conversationId,
                    { unread: false }
                );

                io.emit('conversation-status-update', {
                    conversationId,
                    unread: false
                });
            } catch (error) {
                console.error("Error marking conversation as read:", error);
            }
        });

        socket.on("disconnect", () => {
            console.log("User disconnected:", socket.id);
            if (socket.staffId) {
                staffRooms.delete(socket.staffId);
            }
        });
    });
};