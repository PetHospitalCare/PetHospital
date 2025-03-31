import React, { createContext, useContext, useEffect, useState } from 'react';
import { UserContext } from "@/contexts/UserContext";
import { socket } from "../App"
const ChatContext = createContext(); // Thêm dòng này
export const ChatProvider = ({ children }) => {
    const [currentConversation, setCurrentConversation] = useState(null);
    const [messages, setMessages] = useState([]);
    const { user } = useContext(UserContext);

    const joinConversation = async (conversationId) => {
        if (!socket) return;

        // Load messages
        const res = await fetch(`/messages/${conversationId}`);
        const data = await res.json();
        setMessages(data);

        // Join room
        socket.emit('join-conversation', conversationId);
        setCurrentConversation(conversationId);
    };

    useEffect(() => {
        if (!socket || !currentConversation) return;

        socket.on('new-message', (message) => {
            setMessages(prev => [...prev, message]);
        });

        return () => {
            socket.off('new-message');
        };
    }, [socket, currentConversation]);

    const sendMessage = (content) => {
        if (!socket || !currentConversation || !user) return;

        const message = {
            conversationId: currentConversation,
            sender: user._id,
            content
        };

        socket.emit('send-message', message);
    };

    return (
        <ChatContext.Provider value={{
            currentConversation,
            messages,
            joinConversation,
            sendMessage
        }}>
            {children}
        </ChatContext.Provider>
    );
};

export const useChat = () => useContext(ChatContext);