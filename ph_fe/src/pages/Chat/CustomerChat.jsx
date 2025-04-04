import { useState, useEffect, useRef, useContext } from 'react';
import { ChatContext } from '../../contexts/ChatProvider';
import { UserContext } from '@/contexts/UserContext';
import { Send, Smile, Paperclip, MessageCircle, X, LogIn, Headset } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CustomerChat = () => {
    const navigate = useNavigate();
    const { user } = useContext(UserContext);
    const {
        currentConversation,
        messages,
        joinConversation,
        sendMessage
    } = useContext(ChatContext);

    const [message, setMessage] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [isOnline, setIsOnline] = useState(false);
    const messagesEndRef = useRef(null);

    // Tự động join conversation khi load
    useEffect(() => {
        if (user?._id) {
            fetch(`http://localhost:9999/message/customer/${user?._id}`)
                .then(res => res.json())
                .then(data => joinConversation(data._id));
        }
    }, [user]);

    // Tự động cuộn xuống tin nhắn mới nhất
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

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

    const redirectToLogin = () => {
        navigate('/login');
    };

    // Chat Icon Button (when chat is closed)
    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-28 right-4 w-16 h-16 bg-indigo-600 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-indigo-700 transition-all z-50"
                aria-label="Mở hỗ trợ trực tuyến"
            >
                <MessageCircle size={28} />

            </button>
        );
    }

    // Login prompt if user is not logged in
    if (!user || !user._id) {
        return (
            <>
                {/* Chat window */}
                <div className="fixed bottom-24 right-4 w-80 bg-white rounded-lg shadow-xl border border-gray-200 flex flex-col z-50">
                    {/* Header */}
                    <div className="bg-indigo-600 text-white p-3 rounded-t-lg flex justify-between items-center">
                        <div className="flex items-center">
                            <span>Hỗ trợ khách hàng</span>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="text-white hover:text-indigo-200"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Login message */}
                    <div className="p-6 flex flex-col items-center justify-center">
                        <LogIn size={40} className="text-indigo-500 mb-4" />
                        <p className="text-center text-gray-700 mb-4">
                            Vui lòng đăng nhập để bắt đầu trò chuyện với nhân viên hỗ trợ
                        </p>
                        <button
                            onClick={redirectToLogin}
                            className="bg-indigo-600 text-white py-2 px-6 rounded-lg hover:bg-indigo-700 transition-colors"
                        >
                            Đăng nhập ngay
                        </button>
                    </div>
                </div>

                {/* Close button as a fallback */}
                <button
                    onClick={() => setIsOpen(false)}
                    className="fixed bottom-6 right-6 w-16 h-16 bg-indigo-600 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-indigo-700 transition-all z-40"
                    aria-label="Đóng hỗ trợ trực tuyến"
                >
                    <X size={24} />
                </button>
            </>
        );
    }

    // Full chat window when opened and user is logged in
    return (
        <>
            <div className="fixed bottom-32 right-24 w-80 bg-white rounded-lg shadow-xl border border-gray-200 flex flex-col z-50" style={{ maxHeight: '500px' }}>
                {/* Header */}
                <div className="bg-indigo-600 text-white p-3 rounded-t-lg flex justify-between items-center">
                    <div className="flex items-center">
                        <Headset></Headset>
                        {/* <div className={`w-3 h-3 rounded-full mr-2 ${isOnline ? 'bg-green-400' : 'bg-gray-400'}`}></div> */}
                        <span>Hỗ trợ khách hàng</span>
                    </div>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="text-white hover:text-indigo-200"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Messages area */}
                <div className="flex-1 p-4 overflow-y-auto" style={{ maxHeight: '320px' }}>
                    {messages.length === 0 ? (
                        <div className="text-center text-gray-500 py-8">
                            <p>Bắt đầu trò chuyện với nhân viên hỗ trợ</p>
                        </div>
                    ) : (
                        messages?.map((msg, index) => (
                            <div
                                key={msg._id || index}
                                className={`mb-3 flex ${msg.sender === user._id ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-xs px-4 py-2 rounded-lg ${msg.sender === user._id
                                        ? 'bg-indigo-500 text-white rounded-br-none'
                                        : 'bg-gray-100 text-gray-800 rounded-bl-none'}`}
                                >
                                    <p className="text-sm">{msg.content}</p>
                                    <p className="text-xs mt-1 opacity-70 text-right">
                                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </div>
                            </div>
                        ))
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input area */}
                <div className="border-t border-gray-200 p-3 bg-gray-50">
                    <div className="flex items-center">

                        <input
                            type="text"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Nhập tin nhắn..."
                            className="flex-1 border border-gray-300 rounded-full px-4 py-2 mx-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                        <button
                            onClick={handleSend}
                            disabled={!message.trim()}
                            className={`p-2 rounded-full ${message.trim()
                                ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                        >
                            <Send size={18} />
                        </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-2 text-center">
                        Nhấn Enter để gửi, Shift+Enter để xuống dòng
                    </p>
                </div>
            </div>

            {/* Chat icon visible behind the chat window */}
            <button
                onClick={() => setIsOpen(false)}
                className="fixed bottom-28 right-4 w-16 h-16 bg-indigo-600 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-indigo-700 transition-all z-40"
                aria-label="Đóng hỗ trợ trực tuyến"
            >
                <X size={24} />
            </button>
        </>
    );
};

export default CustomerChat;