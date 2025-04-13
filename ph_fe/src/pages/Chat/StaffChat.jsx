import { useState, useEffect, useContext, useRef } from 'react';
import { ChatContext } from '../../contexts/ChatProvider';
import { UserContext } from '@/contexts/UserContext';
import { Send, ChevronRight, User, Users, MessageSquare, Bell } from 'lucide-react';
import { socket } from "../../App";
import { MessageService } from '@/services/MessageService';
import { UserService } from '@/services/UserService';

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
    const [userNames, setUserNames] = useState({});
    const [userAvatars, setUserAvatars] = useState({});
    // Request notification permission on component mount
    useEffect(() => {
        if ('Notification' in window && Notification.permission !== 'granted' && Notification.permission !== 'denied') {
            Notification.requestPermission();
        }
    }, []);
    useEffect(() => {
        const fetchUserNames = async () => {
            const uniqueUserIds = [...new Set(filteredMessages.map(msg => msg.sender))];

            for (const userId of uniqueUserIds) {
                if (!userNames[userId] && userId !== user._id) {
                    try {
                        const userData = await UserService.getAccountbyId(userId);
                        // Check if roles array includes 'customer'
                        const isCustomer = userData.data.account.role.includes('customer');
                        let displayName;

                        if (isCustomer) {
                            displayName = `Khách hàng - ${userData.data.account.username}`;
                        } else {
                            const roleDisplay = userData.data.account.role.includes('admin') ? 'Admin' : 'Nhân viên';
                            displayName = `${roleDisplay} - ${userData.data.account.username}`;
                        }

                        setUserNames(prev => ({
                            ...prev,
                            [userId]: displayName
                        }));
                        // Add avatar if exists
                        if (userData?.data?.account?.url) {
                            setUserAvatars(prev => ({
                                ...prev,
                                [userId]: userData?.data?.account?.url
                            }));
                        }
                    } catch (error) {
                        console.error('Error fetching user name:', error);
                    }
                }
            }
        };

        fetchUserNames();
    }, [filteredMessages]);

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

            // Đưa conversation hiện tại lên đầu khi gửi tin nhắn
            setConversations(prevConversations => {
                // Tìm conversation hiện tại
                const currentConv = prevConversations.find(conv => conv._id === currentConversation);
                const otherConvs = prevConversations.filter(conv => conv._id !== currentConversation);

                // Cập nhật thông tin của conversation hiện tại
                const updatedCurrentConv = {
                    ...currentConv,
                    lastMessage: message,
                    updatedAt: new Date().toISOString()
                };

                // Đặt conversation hiện tại lên đầu danh sách
                return [updatedCurrentConv, ...otherConvs];
            });

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
        // Cập nhật UI ngay lập tức
        setConversations(prevConversations =>
            prevConversations.map(conv => {
                if (conv._id === conversationId) {
                    return {
                        ...conv,
                        unread: false
                    };
                }
                return conv;
            })
        );

        // Gọi các hàm xử lý khác
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
                            Conversations
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
                                        className={`mb-3 flex items-start ${msg.sender === user._id ? 'justify-end' : 'justify-start'
                                            }`}
                                    >
                                        {/* Avatar and name for customer messages */}
                                        {msg.sender !== user._id && (
                                            <div className="flex flex-col items-center mr-2">
                                                <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center bg-gray-200">
                                                    {userAvatars[msg.sender] ? (
                                                        <img
                                                            src={userAvatars[msg.sender]}
                                                            alt="avatar"
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <User size={16} className="text-gray-500" />
                                                    )}
                                                </div>
                                                <span className="text-xs text-gray-500 mt-1">
                                                    {userNames[msg.sender]}
                                                </span>
                                            </div>
                                        )}

                                        <div
                                            className={`max-w-xs px-4 py-2 rounded-lg ${msg.sender === user._id
                                                ? 'bg-indigo-500 text-white rounded-br-none'
                                                : 'bg-white text-gray-800 rounded-bl-none shadow-sm'
                                                }`}
                                        >
                                            <p className="text-sm">{msg.content}</p>
                                            <p className="text-xs mt-1 opacity-70 text-right">
                                                {new Date(msg.createdAt).toLocaleTimeString([], {
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                })}
                                            </p>
                                        </div>

                                        {/* Avatar and name for staff messages */}
                                        {msg.sender === user._id && (
                                            <div className="flex flex-col items-center ml-2">
                                                <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center bg-indigo-100">
                                                    {user.avatar ? (
                                                        <img
                                                            src={user.avatar}
                                                            alt="staff avatar"
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <User size={16} className="text-indigo-500" />
                                                    )}
                                                </div>
                                                <span className="text-xs text-gray-500 mt-1">
                                                    {user.role === 'staff'
                                                        ? `Nhân viên - ${user.username}`
                                                        : user.role === 'admin'
                                                            ? `Admin - ${user.username}`
                                                            : user.username || 'Staff'
                                                    }
                                                </span>
                                            </div>
                                        )}
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