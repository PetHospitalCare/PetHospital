import { useState, useEffect, useContext, useRef } from 'react';
import { ChatContext } from '../../contexts/ChatProvider';
import { UserContext } from '@/contexts/UserContext';
import { Send, ChevronRight, User, Users, MessageSquare, Bell } from 'lucide-react';
import { socket } from "../../App";
import { MessageService } from '@/services/MessageService';
import { UserService } from '@/services/UserService';
import { Menu, X } from 'lucide-react';
import { cn } from "@/lib/utils";
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
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
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
                        const isCustomer = userData?.data?.account?.role.includes('customer');
                        let displayName;

                        if (isCustomer) {
                            displayName = `Khách hàng - ${userData.data.account.username}`;
                        } else {
                            const roleDisplay = userData?.data?.account?.role.includes('admin') ? 'Admin' : 'Nhân viên';
                            displayName = `${roleDisplay} - ${userData?.data?.account?.username}`;
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
            {/* Sidebar */}
            <div className="hidden md:flex flex-col w-80 border-r border-gray-200 bg-white">
                {/* Sidebar Header */}
                <div className="p-4 border-b border-gray-200">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-semibold flex items-center">
                            <MessageSquare className="mr-2" size={20} />
                            Cuộc trò chuyện
                        </h2>
                    </div>
                    <div className="mt-3 relative">
                        <input
                            type="text"
                            placeholder="Tìm kiếm khách hàng..."
                            className="w-full pl-8 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <User className="absolute left-2 top-3 text-gray-400" size={18} />
                    </div>
                </div>

                {/* Conversations List */}
                <div className="flex-1 overflow-y-auto">
                    {filteredConversations.length === 0 ? (
                        <div className="p-6 text-center text-gray-500">
                            {searchTerm ? 'Không tìm thấy cuộc trò chuyện' : 'Chưa có cuộc trò chuyện nào'}
                        </div>
                    ) : (
                        filteredConversations.map(conv => (
                            <div
                                key={conv._id}
                                className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${currentConversation === conv._id ? 'bg-indigo-50' : ''
                                    }`}
                                onClick={() => handleJoinConversation(conv._id)}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-medium flex items-center">
                                            {conv.customerId?.username ?
                                                `Khách hàng - ${conv.customerId.username}` :
                                                'Khách hàng không xác định'}
                                            {conv.unread && (
                                                <span className="ml-2 w-2 h-2 rounded-full bg-red-500"></span>
                                            )}
                                        </h4>
                                        <p className="text-sm text-gray-500 mt-1 flex items-center truncate">
                                            <Users className="mr-1 flex-shrink-0" size={14} />
                                            {conv.unread ? (
                                                <span className="font-medium text-indigo-600 truncate">
                                                    {conv.lastMessage || 'Bạn có tin nhắn mới'}
                                                </span>
                                            ) : (
                                                <span className="truncate">{conv.lastMessage || ''}</span>
                                            )}
                                        </p>
                                    </div>
                                    <ChevronRight size={18} className="text-gray-400 flex-shrink-0 ml-2" />
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col">
                {currentConversation ? (
                    <>
                        {/* Chat Header */}
                        <div className="p-4 border-b border-gray-200 bg-white flex items-center sticky top-0">
                            <button className="md:hidden mr-4 hover:bg-gray-100 p-2 rounded-lg">
                                <ChevronRight size={20} />
                            </button>
                            <div className="flex-1 min-w-0">
                                <h3 className="font-semibold truncate">
                                    {conversations.find(c => c._id === currentConversation)?.customerId?.username || 'Chat'}
                                </h3>
                            </div>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
                            <div className="max-w-3xl mx-auto space-y-4">
                                {filteredMessages.length === 0 ? (
                                    <div className="h-full flex items-center justify-center text-gray-500">
                                        Bắt đầu cuộc trò chuyện!
                                    </div>
                                ) : (
                                    filteredMessages.map((msg, index) => (
                                        <div
                                            key={msg._id || index}
                                            className={`flex items-start gap-2 ${msg.sender === user._id ? 'justify-end' : 'justify-start'
                                                }`}
                                        >
                                            {msg.sender !== user._id && (
                                                <div className="flex flex-col items-center">
                                                    <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                                                        {userAvatars[msg.sender] ? (
                                                            <img
                                                                src={userAvatars[msg.sender]}
                                                                alt="avatar"
                                                                className="w-full h-full object-cover"
                                                            />
                                                        ) : (
                                                            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                                                <User size={16} className="text-gray-500" />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <span className="text-xs text-gray-500 mt-1">
                                                        {userNames[msg.sender] || 'Khách hàng'}
                                                    </span>
                                                </div>
                                            )}

                                            <div className={`max-w-[70%] px-4 py-2 rounded-lg ${msg.sender === user._id
                                                ? 'bg-indigo-500 text-white ml-auto rounded-br-none'
                                                : 'bg-white text-gray-800 rounded-bl-none shadow-sm'
                                                }`}>
                                                <p className="text-sm whitespace-pre-wrap break-words">
                                                    {msg.content}
                                                </p>
                                                <p className="text-xs mt-1 opacity-70 text-right">
                                                    {new Date(msg.createdAt).toLocaleTimeString([], {
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </p>
                                            </div>

                                            {msg.sender === user._id && (
                                                <div className="flex flex-col items-center">
                                                    <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                                                        {user.avatar ? (
                                                            <img
                                                                src={user.avatar}
                                                                alt="staff avatar"
                                                                className="w-full h-full object-cover"
                                                            />
                                                        ) : (
                                                            <div className="w-full h-full bg-indigo-100 flex items-center justify-center">
                                                                <User size={16} className="text-indigo-500" />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <span className="text-xs text-gray-500 mt-1">
                                                        {user?.role === 'staff'
                                                            ? `Nhân viên - ${user.username}`
                                                            : `Admin - ${user.username}`
                                                        }
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    ))
                                )}
                                <div ref={messagesEndRef} />
                            </div>
                        </div>

                        {/* Message Input */}
                        <div className="p-4 border-t border-gray-200 bg-white sticky bottom-0">
                            <div className="max-w-3xl mx-auto">
                                <div className="flex items-center gap-2">
                                    <input
                                        type="text"
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        onKeyPress={handleKeyPress}
                                        placeholder="Nhập tin nhắn..."
                                        className="flex-1 border border-gray-300 rounded-full px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                    <button
                                        onClick={handleSend}
                                        disabled={!message.trim()}
                                        className={`p-2.5 rounded-full transition-colors ${message.trim()
                                            ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                            }`}
                                    >
                                        <Send size={20} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="h-full flex items-center justify-center bg-gray-50 p-4">
                        <div className="text-center max-w-md mx-auto">
                            <MessageSquare size={48} className="mx-auto text-gray-300 mb-4" />
                            <h3 className="text-lg font-medium text-gray-700 mb-2">
                                Chưa chọn cuộc trò chuyện
                            </h3>
                            <p className="text-gray-500">
                                Chọn một cuộc trò chuyện từ danh sách để bắt đầu
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};