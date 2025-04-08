import { useState, useEffect, useContext, useRef } from 'react';
import { ChatContext } from '../../contexts/ChatProvider';
import { UserContext } from '@/contexts/UserContext';
import { Send, ChevronRight, User, Users, MessageSquare, Bell } from 'lucide-react';
import { socket } from "../../App";
import { MessageService } from '@/services/MessageService';

export const StaffChat = () => {
    const { user } = useContext(UserContext);
    const {
        currentConversation,
        messages,
        notifications,
        joinConversation,
        sendMessage,
        clearNotifications
    } = useContext(ChatContext);

    const [conversations, setConversations] = useState([]);
    const [filteredMessages, setFilteredMessages] = useState([]);
    const [message, setMessage] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [showNotifications, setShowNotifications] = useState(false);
    const messagesEndRef = useRef(null);

    // Request notification permission on component mount
    useEffect(() => {
        if ('Notification' in window && Notification.permission !== 'granted' && Notification.permission !== 'denied') {
            Notification.requestPermission();
        }
    }, []);

    // Filter messages by current conversation
    useEffect(() => {
        if (currentConversation) {
            const filtered = messages.filter(msg =>
                msg.conversationId === currentConversation
            );
            setFilteredMessages(filtered);
        } else {
            setFilteredMessages([]);
        }
    }, [messages, currentConversation]);

    // Fetch conversations
    useEffect(() => {
        const fetchConversations = async () => {
            try {
                const res = await MessageService.fetchConversations();
                if (res.status !== 200) throw new Error('Failed to fetch conversations');

                setConversations(res.data);
            } catch (error) {
                console.error('Error fetching conversations:', error);
            }
        };

        fetchConversations();
    }, []);

    // Socket listeners for real-time updates
    useEffect(() => {
        const handleConversationUpdate = (conversation) => {
            console.log("Conversation update received:", conversation); // Debug log
            setConversations(prevConversations => {
                return prevConversations.map(conv => {
                    if (conv._id === conversation.conversationId) {
                        return {
                            ...conv,
                            unread: conversation.unread,
                            lastMessage: conversation.lastMessage || conv.lastMessage,
                            updatedAt: conversation.timestamp || conv.updatedAt
                        };
                    }
                    return conv;
                });
            });
        };

        const handleNewConversation = (newConversation) => {
            console.log("New conversation received:", newConversation); // Debug log
            setConversations(prevConversations => {
                // Check if the conversation already exists
                const exists = prevConversations.some(conv => conv._id === newConversation._id);
                if (!exists) {
                    // If it doesn't exist, add it to the list and mark as unread
                    return [
                        {
                            ...newConversation,
                            unread: true
                        },
                        ...prevConversations
                    ];
                }
                return prevConversations;
            });
        };

        socket.on('conversation-status-update', handleConversationUpdate);
        socket.on('new-conversation', handleNewConversation);

        return () => {
            socket.off('conversation-status-update', handleConversationUpdate);
            socket.off('new-conversation', handleNewConversation);
        };
    }, []);

    // Auto scroll to bottom when messages change
    useEffect(() => {
        scrollToBottom();
    }, [filteredMessages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleSend = () => {
        if (message.trim() && currentConversation) {
            sendMessage(message);
            setMessage('');
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleJoinConversation = (conversationId) => {
        joinConversation(conversationId);
        clearNotifications(conversationId);
        setShowNotifications(false);
    };

    // Filter conversations by search term
    const filteredConversations = conversations
        .filter(conv =>
            conv.customerId?.username?.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .sort((a, b) => {
            // First sort by unread status (unread conversations come first)
            if (a.unread !== b.unread) {
                return a.unread ? -1 : 1; // true values come before false values
            }

            // Then sort by updatedAt (most recent first)
            return new Date(b.updatedAt) - new Date(a.updatedAt);
        });

    // Count unread notifications
    const unreadCount = notifications.length;

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Conversation sidebar */}
            <div className="w-80 border-r border-gray-200 bg-white flex flex-col">
                <div className="p-4 border-b border-gray-200">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-semibold flex items-center">
                            <MessageSquare className="mr-2" size={20} />
                            Trò Chuyện
                        </h2>
                    </div>
                    <div className="mt-3 relative">
                        <input
                            type="text"
                            placeholder="Search customers..."
                            className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <User className="absolute left-2 top-2.5 text-gray-400" size={18} />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                    {filteredConversations.length === 0 ? (
                        <div className="p-4 text-center text-gray-500">
                            {searchTerm ? 'No matching conversations' : 'No active conversations'}
                        </div>
                    ) : (
                        filteredConversations.map(conv => (
                            <div
                                key={conv._id}
                                className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 flex items-center justify-between ${currentConversation === conv._id ? 'bg-indigo-50' : ''}`}
                                onClick={() => handleJoinConversation(conv._id)}
                            >
                                <div className="flex-1">
                                    <h4 className="font-medium flex items-center">
                                        {conv.customerId?.username ? `Khách hàng - ${conv.customerId.username}` : 'Unknown Customer'}
                                        {conv.unread && (
                                            <span className="ml-2 w-2 h-2 rounded-full bg-red-500"></span>
                                        )}
                                    </h4>
                                    <p className="text-sm text-gray-500 mt-1 flex items-center truncate">
                                        <Users className="mr-1" size={14} />
                                        {conv.unread ? (
                                            <span className="font-medium text-indigo-600">
                                                {conv.lastMessage ? conv.lastMessage : 'Bạn có tin nhắn mới'}
                                            </span>
                                        ) : (
                                            <span className="truncate">{conv.lastMessage || ''}</span>
                                        )}
                                    </p>
                                </div>
                                <ChevronRight size={18} className="text-gray-400" />
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Chat area */}
            <div className="flex-1 flex flex-col">
                {currentConversation ? (
                    <>
                        {/* Chat header */}
                        <div className="p-4 border-b border-gray-200 bg-white flex items-center">
                            <div className="flex-1">
                                <h3 className="font-semibold">
                                    {conversations.find(c => c._id === currentConversation)?.customerId?.username || 'Chat'}
                                </h3>
                                <p className="text-sm text-gray-500"></p>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
                            {filteredMessages.length === 0 ? (
                                <div className="h-full flex items-center justify-center text-gray-500">
                                    No messages yet. Start the conversation!
                                </div>
                            ) : (
                                filteredMessages.map((msg, index) => (
                                    <div
                                        key={msg._id || index}
                                        className={`mb-3 flex ${msg.sender === user._id ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div
                                            className={`max-w-xs px-4 py-2 rounded-lg ${msg.sender === user._id
                                                ? 'bg-indigo-500 text-white rounded-br-none'
                                                : 'bg-white text-gray-800 rounded-bl-none shadow-sm'}`}
                                        >
                                            <p className="text-sm">{msg.content}</p>
                                            <p className="text-xs mt-1 opacity-70 text-right">
                                                {new Date(msg.createdAt).toLocaleTimeString([], {
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Message input */}
                        <div className="p-4 border-t border-gray-200 bg-white">
                            <div className="flex items-center">
                                <input
                                    type="text"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    placeholder="Type a message..."
                                    className="flex-1 border border-gray-300 rounded-l-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                />
                                <button
                                    onClick={handleSend}
                                    disabled={!message.trim()}
                                    className={`px-4 py-2 rounded-r-full ${message.trim()
                                        ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                        }`}
                                >
                                    <Send size={18} />
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="h-full flex items-center justify-center bg-gray-50">
                        <div className="text-center p-6 max-w-md">
                            <MessageSquare size={48} className="mx-auto text-gray-300 mb-4" />
                            <h3 className="text-lg font-medium text-gray-700 mb-2">No conversation selected</h3>
                            <p className="text-gray-500">
                                Select a conversation from the sidebar to start chatting with customers
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};