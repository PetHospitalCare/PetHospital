
const express = require('express');
const { MessageController } = require('../controllers');
const { verifyToken, authorize } = require('../middlewares/auth');
const MessageRoute = express.Router();

MessageRoute.post("/create", MessageController.GetOrCreateConversation);
MessageRoute.get("/test", async (req, res) => {
    return res.json({ message: "hello world" });
});
module.exports = MessageRoute;

