
const express = require('express');
const { MessageController } = require('../controllers');
const { verifyToken, authorize } = require('../middlewares/auth');
const MessageRoute = express.Router();

MessageRoute.get("/customer/:customerId", MessageController.GetOrCreateConversation);
MessageRoute.get("/staff", MessageController.GetAllConversation);
MessageRoute.post("/send", MessageController.CreateMessage);
MessageRoute.get("/:conversationId", MessageController.GetMessageByConversationId);
MessageRoute.get("/test/test", async (req, res) => {
    return res.json({ message: "hello world" });
});
module.exports = MessageRoute;

