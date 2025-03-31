import React, { createContext, useContext, useEffect, useState } from 'react';
import { UserContext } from "@/contexts/UserContext";
import { socket } from "../App"

const ChatContext = createContext();

const ChatProvider = ({ children }) => {
    const [currentConversation, setCurrentConversation] = useState(null);
    const [messages, setMessages] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const { user } = useContext(UserContext);

    const joinConversation = async (conversationId) => {
        if (!socket || !user) return;

        // Load messages
        const res = await fetch(`http://localhost:9999/message/${conversationId}`);
        const data = await res.json();
        setMessages(data);

        // Join room
        socket.emit('join-conversation', conversationId);
        setCurrentConversation(conversationId);

        // Mark as read
        socket.emit('mark-as-read', conversationId);

        // Remove notifications for this conversation
        setNotifications(prev => prev.filter(n => n.conversationId !== conversationId));
    };

    useEffect(() => {
        if (!socket || !user) return;

        // Identify as staff to socket server
        if (user.role && user.role.includes('staff')) {
            socket.emit('staff-login', user._id);
        }

        socket.on('new-message', (message) => {
            setMessages(prev => [...prev, message]);
        });
        socket.on('new-conversation', (conversation) => {
            // Sẽ được xử lý trong StaffChat
        });


        // Listen for notifications
        socket.on('new-message-notification', (notification) => {
            // Play notification sound
            const audio = new Audio('/notification-sound.mp3'); // Create an audio file for notifications
            audio.play().catch(e => console.log('Audio play failed:', e));

            // Add notification to state
            setNotifications(prev => [notification, ...prev].slice(0, 50)); // Keep last 50 notifications

            // Show browser notification if supported
            if ('Notification' in window && Notification.permission === 'granted') {
                new Notification(`New message from ${notification.customerName}`, {
                    body: notification.message.substring(0, 60) + (notification.message.length > 60 ? '...' : ''),
                    icon: '/notification-icon.png' // Add your notification icon
                });
            }
        });

        socket.on('conversation-status-update', (data) => {
            // This will be handled in StaffChat component
        });

        return () => {
            socket.off('new-message');
            socket.off('new-message-notification');
            socket.off('conversation-status-update');
            socket.off('new-conversation'); // Nhớ bỏ lắng nghe khi unmount
        };
    }, [socket, user]);

    const sendMessage = (content) => {
        if (!socket || !currentConversation || !user) return;
        const message = {
            conversationId: currentConversation,
            sender: user._id,
            content
        };

        socket.emit('send-message', message);
    };

    const clearNotifications = (conversationId) => {
        setNotifications(prev => prev.filter(n => n.conversationId !== conversationId));
    };

    return (
        <ChatContext.Provider value={{
            currentConversation,
            messages,
            notifications,
            joinConversation,
            sendMessage,
            clearNotifications
        }}>
            {children}
        </ChatContext.Provider>
    );
};

export { ChatContext, ChatProvider };