import axios from "../axios";


const fetchConversations = () => { return axios.get("/message/staff"); }
const getConversationById = (id) => { return axios.get(`message/customer/${id}`) };
const getNotification = () => {
    return axios.get("/notification/get-all");
}
const MarkNotificationAsRead = () => {
    return axios.put("/notification/mark-as-read");
}
const getMessagesByConversationId = (conversationId) => {
    return axios.get(`/message/${conversationId}`);
}

export const MessageService = {
    fetchConversations,
    getConversationById,
    getNotification,
    MarkNotificationAsRead,
    getMessagesByConversationId
};
