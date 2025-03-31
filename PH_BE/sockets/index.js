const db = require("../models");
const Message = db.message;
module.exports = (io) => {
    io.on("connection", (socket) => {
        console.log("New connection:", socket.id);

        socket.on("join-conversation", (conversationId) => {
            socket.join(`conversation_${conversationId}`);
            console.log(`User joined conversation ${conversationId}`);
        });

        socket.on("send-message", async (data) => {
            try {
                const message = new Message(data);
                await message.save();
                io.to(`conversation_${data.conversationId}`).emit("new-message", message);
            } catch (error) {
                console.error("Error sending message:", error);
            }
        });

        socket.on("disconnect", () => {
            console.log("User disconnected:", socket.id);
        });
    });
};
