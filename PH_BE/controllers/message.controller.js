const db = require("../models");
const Message = db.message
const Conversation = db.conversation
const GetOrCreateConversation = async (req, res) => {
    try {
        let conversation = await Conversation.findOne({
            customerId: req.params.customerId
        }).populate('staffParticipants', 'username avatar');

        if (!conversation) {
            conversation = await Conversation.create({
                customerId: req.params.customerId,
                staffParticipants: [] // Ban đầu chưa có nhân viên
            });
        }

        res.json(conversation);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
const GetAllConversation = async (req, res) => {
    try {
        const conversations = await Conversation.find({})
            .populate('customerId', 'username avatar')
            .populate('staffParticipants', 'username avatar');

        res.json(conversations);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
const CreateMessage = async (req, res) => {
    try {
        const { conversationId, sender, content } = req.body;

        const message = new Message({
            conversationId,
            sender,
            content
        });

        await message.save();
        res.status(201).json(message);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
const GetMessageByConversationId = async (req, res) => {
    try {
        const messages = await Message.find({
            conversationId: req.params.conversationId
        }).sort({ createdAt: 1 });

        res.json(messages);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
module.exports = {
    GetOrCreateConversation, GetAllConversation, GetMessageByConversationId, CreateMessage
};