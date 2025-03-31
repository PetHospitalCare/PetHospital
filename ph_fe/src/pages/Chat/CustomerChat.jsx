import { useEffect, useState, useContext } from 'react';
import { useChat } from '../../contexts/ChatProvider';
import { UserContext } from "@/contexts/UserContext";
export const CustomerChat = () => {
    const { user } = useContext(UserContext);
    const {
        currentConversation,
        messages,
        joinConversation,
        sendMessage
    } = useChat();
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (user) {
            // Tự động join conversation khi load
            fetch(`/conversations/customer/${user._id}`)
                .then(res => res.json())
                .then(data => joinConversation(data._id));
        }
    }, [user]);

    const handleSend = () => {
        if (message.trim()) {
            sendMessage(message);
            setMessage('');
        }
    };

    return (
        <div className="chat-container">
            <div className="messages">
                {messages.map(msg => (
                    <div key={msg._id} className={`message ${msg.sender === user._id ? 'sent' : 'received'}`}>
                        <p>{msg.content}</p>
                    </div>
                ))}
            </div>
            <div className="message-input">
                <input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                />
                <button onClick={handleSend}>Gửi</button>
            </div>
        </div>
    );
};