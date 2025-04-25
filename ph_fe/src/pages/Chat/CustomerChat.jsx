import { useState, useEffect, useRef, useContext } from 'react';
import { ChatContext } from '../../contexts/ChatProvider';
import { UserContext } from '@/contexts/UserContext';
import { useNavigate } from 'react-router-dom';
import { MessageService } from '@/services/MessageService';
import { UserService } from '@/services/UserService';
import { Send, MessageCircle, X, LogIn, Headset, User } from 'lucide-react';

const CustomerChat = () => {
    const navigate = useNavigate();
    const { user } = useContext(UserContext);
    const { currentConversation, messages, joinConversation, sendMessage } = useContext(ChatContext);

    const [message, setMessage] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [userNames, setUserNames] = useState({});
    const [userAvatars, setUserAvatars] = useState({});
    const messagesEndRef = useRef(null);

    // Fetch user data for messages
    useEffect(() => {
        const fetchUserData = async () => {
            const uniqueUserIds = [...new Set(messages.map(msg => msg.sender))];

            for (const userId of uniqueUserIds) {
                if (!userNames[userId] && userId !== user._id) {
                    try {
                        const userData = await UserService.getAccountbyId(userId);
                        const isCustomer = userData?.data?.account?.role.includes('customer');
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

                        if (userData?.data?.account?.url) {
                            setUserAvatars(prev => ({
                                ...prev,
                                [userId]: userData.data.account.url
                            }));
                        }
                    } catch (error) {
                        console.error('Error fetching user data:', error);
                    }
                }
            }
        };

        fetchUserData();
    }, [messages]);

    // Fetch initial conversation
    useEffect(() => {
        const fetchConversation = async () => {
            if (user?._id) {
                try {
                    const data = await MessageService.getConversationById(user._id);
                    joinConversation(data?.data?._id);
                } catch (error) {
                    console.error("Error fetching conversation:", error);
                }
            }
        };
        fetchConversation();
    }, [user]);

    // Auto scroll to bottom
    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleSend = () => {
        if (message.trim()) {
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

    // Format message with line breaks
    const formatMessage = (content) => {
        return content.split('\n').map((line, i) => (
            <span key={i}>
                {line}
                {i !== content.split('\n').length - 1 && <br />}
            </span>
        ));
    };
    if (!user?.role?.includes('customer')) {
        return null; // Don't render anything if user is not a customer
    }

    // Chat button when closed
    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-20 right-4 w-12 h-12 bg-[#3F2E2E] text-white rounded-full shadow-lg flex items-center justify-center hover:bg-primary/90 transition-all z-50"
            >
                <MessageCircle size={24} />
            </button>
        );
    }


    // Login prompt
    if (!user || !user._id) {
        return (
            <div className="fixed bottom-20 right-4 w-96 bg-white rounded-lg shadow-xl border border-gray-200 flex flex-col z-50">
                <div className="bg-[#3F2E2E] text-white p-3 rounded-t-lg flex justify-between items-center">
                    <div className="flex items-center">
                        <Headset size={20} className="mr-2" />
                        <span>Hỗ trợ khách hàng</span>
                    </div>
                    <button onClick={() => setIsOpen(false)} className="text-white hover:text-gray-200">
                        <X size={20} />
                    </button>
                </div>
                <div className="p-6 flex flex-col items-center">
                    <LogIn size={40} className="text-[#3F2E2E] mb-4" />
                    <p className="text-center text-gray-700 mb-4">
                        Vui lòng đăng nhập để bắt đầu trò chuyện
                    </p>
                    <button
                        onClick={() => navigate('/login')}
                        className="bg-[#3F2E2E] text-white py-2 px-6 rounded-lg hover:bg-[#3F2E2E]/90"
                    >
                        Đăng nhập ngay
                    </button>
                </div>
            </div>
        );
    }

    // Main chat window
    return (
        <div className="fixed bottom-20 right-4 w-96 bg-white rounded-lg shadow-xl border border-gray-200 flex flex-col z-50"
            style={{ maxHeight: '500px' }}>
            {/* Header */}
            <div className="bg-[#3F2E2E] text-white p-3 rounded-t-lg flex justify-between items-center">
                <div className="flex items-center">
                    <Headset size={20} className="mr-2" />
                    <span>Hỗ trợ khách hàng</span>
                </div>
                <button onClick={() => setIsOpen(false)} className="text-white hover:text-gray-200">
                    <X size={20} />
                </button>
            </div>

            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto" style={{ maxHeight: '360px' }}>
                {messages.length === 0 ? (
                    <div className="text-center text-gray-500 py-4">
                        <p>Bắt đầu trò chuyện với nhân viên hỗ trợ</p>
                    </div>
                ) : (
                    messages.map((msg, index) => (
                        <div
                            key={msg._id || index}
                            className={`mb-3 flex items-start ${msg.sender === user._id ? 'justify-end' : 'justify-start'}`}
                        >
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
                                        {userNames[msg.sender] || 'Staff'}
                                    </span>
                                </div>
                            )}

                            <div className={`max-w-[260px] px-4 py-2 rounded-lg break-words ${msg.sender === user._id
                                ? 'bg-[#3F2E2E] text-white rounded-br-none'
                                : 'bg-gray-100 text-gray-800 rounded-bl-none'
                                }`}>
                                <p className="text-sm whitespace-pre-wrap">
                                    {formatMessage(msg.content)}
                                </p>
                                <p className="text-xs mt-1 opacity-70 text-right">
                                    {new Date(msg.createdAt).toLocaleTimeString([], {
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </p>
                            </div>

                            {msg.sender === user._id && (
                                <div className="flex flex-col items-center ml-2">
                                    <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center bg-gray-200">
                                        {user.avatar ? (
                                            <img
                                                src={user.avatar}
                                                alt="user avatar"
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <User size={16} className="text-gray-500" />
                                        )}
                                    </div>
                                    <span className="text-xs text-gray-500 mt-1">
                                        Bạn
                                    </span>
                                </div>
                            )}
                        </div>
                    ))
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input area */}
            <div className="border-t border-gray-200 p-3 bg-gray-50">
                <div className="flex items-center">
                    <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={handleKeyPress}
                        placeholder="Nhập tin nhắn..."
                        rows="1"
                        className="flex-1 border border-gray-300 rounded-2xl px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#3F2E2E] resize-none min-h-[40px] max-h-[120px]"
                        style={{
                            height: 'auto',
                            overflow: 'hidden'
                        }}
                        onInput={(e) => {
                            e.target.style.height = 'auto';
                            e.target.style.height = e.target.scrollHeight + 'px';
                        }}
                    />
                    <button
                        onClick={handleSend}
                        disabled={!message.trim()}
                        className={`ml-2 p-2 rounded-full ${message.trim()
                            ? 'bg-[#3F2E2E] text-white hover:bg-[#3F2E2E]/90'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            }`}
                    >
                        <Send size={20} />
                    </button>
                </div>
                <p className="text-xs text-gray-500 mt-1 text-center">
                    Nhấn Enter để gửi, Shift + Enter để xuống dòng
                </p>
            </div>
        </div>
    );
};

export default CustomerChat;