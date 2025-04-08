
const express = require('express');
const { MessageController } = require('../controllers');
const { verifyToken, authorize } = require('../middlewares/auth');
const MessageRoute = express.Router();

MessageRoute.get("/customer/:customerId", MessageController.GetOrCreateConversation);
// MessageRoute.get("/staff", MessageController.GetAllConversation);
MessageRoute.get('/conversations', MessageController.GetAllConversation);
MessageRoute.get('/staff', MessageController.GetStaffConversations);
MessageRoute.post("/send", MessageController.CreateMessage);
MessageRoute.get("/:conversationId", MessageController.GetMessageByConversationId);

module.exports = MessageRoute;

