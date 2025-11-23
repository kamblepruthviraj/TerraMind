import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { Send, User, Clock, MessageSquare, X } from 'lucide-react';

export default function CommunityChat({ onClose }) {
    const { data: session } = useSession();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [sending, setSending] = useState(false);
    const chatContainerRef = useRef(null);

    const fetchMessages = async () => {
        try {
            const res = await fetch('/api/community-chat');
            const data = await res.json();
            if (data.success) {
                setMessages(data.data);
            }
        } catch (error) {
            console.error("Failed to fetch messages:", error);
        }
    };

    useEffect(() => {
        fetchMessages();
        const interval = setInterval(fetchMessages, 3000); // Poll every 3 seconds
        return () => clearInterval(interval);
    }, []);

    const scrollToBottom = () => {
        if (chatContainerRef.current) {
            const { scrollHeight, clientHeight } = chatContainerRef.current;
            chatContainerRef.current.scrollTo({
                top: scrollHeight - clientHeight,
                behavior: 'smooth'
            });
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !session) return;

        setSending(true);
        try {
            const res = await fetch('/api/community-chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: newMessage }),
            });

            if (res.ok) {
                setNewMessage('');
                fetchMessages(); // Immediate update
            } else {
                alert("Failed to send message.");
            }
        } catch (error) {
            console.error("Error sending message: ", error);
            alert("Failed to send message. Please try again.");
        } finally {
            setSending(false);
        }
    };

    const formatTime = (timestamp) => {
        if (!timestamp) return '';
        const date = new Date(timestamp);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col h-[600px] overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-gray-100 bg-primary-50/30 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary-100 rounded-lg text-primary-600">
                        <MessageSquare size={20} />
                    </div>
                    <div>
                        <h2 className="font-bold text-gray-900">Community Chat</h2>
                        <p className="text-xs text-gray-500">Updates every 3s</p>
                    </div>
                </div>
                {onClose && (
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all"
                    >
                        <X size={20} />
                    </button>
                )}
            </div>

            {/* Messages Area */}
            <div
                ref={chatContainerRef}
                className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/30 custom-scrollbar"
            >
                {messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400 space-y-2">
                        <MessageSquare size={40} className="opacity-20" />
                        <p className="text-sm">No messages yet.</p>
                    </div>
                ) : (
                    messages.map((msg) => {
                        const isOwnMessage = session?.user?.id === msg.senderUid;
                        return (
                            <div
                                key={msg._id}
                                className={`flex flex-col ${isOwnMessage ? 'items-end' : 'items-start'}`}
                            >
                                <div className={`flex items-end gap-2 max-w-[85%] ${isOwnMessage ? 'flex-row-reverse' : 'flex-row'}`}>
                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${isOwnMessage ? 'bg-primary-100 text-primary-600' : 'bg-gray-200 text-gray-600'}`}>
                                        <User size={12} />
                                    </div>

                                    <div className={`p-3 rounded-2xl shadow-sm ${isOwnMessage
                                            ? 'bg-primary-600 text-white rounded-tr-none'
                                            : 'bg-white border border-gray-100 text-gray-800 rounded-tl-none'
                                        }`}>
                                        {!isOwnMessage && (
                                            <p className="text-[10px] font-bold text-primary-600 mb-0.5">{msg.senderName}</p>
                                        )}
                                        <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">{msg.text}</p>
                                    </div>
                                </div>
                                <span className={`text-[10px] text-gray-400 mt-1 flex items-center gap-1 ${isOwnMessage ? 'mr-8' : 'ml-8'}`}>
                                    <Clock size={10} />
                                    {formatTime(msg.timestamp)}
                                </span>
                            </div>
                        );
                    })
                )}
            </div>

            {/* Input Area */}
            <div className="p-3 border-t border-gray-100 bg-white">
                <form onSubmit={handleSendMessage} className="flex gap-2">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 rounded-xl border-gray-200 shadow-sm focus:border-primary-500 focus:ring-primary-500 p-3 text-sm transition-all bg-gray-50 focus:bg-white"
                        disabled={sending}
                    />
                    <button
                        type="submit"
                        disabled={sending || !newMessage.trim()}
                        className="bg-primary-600 text-white p-3 rounded-xl hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-primary-600/20 flex items-center justify-center min-w-[50px]"
                    >
                        {sending ? (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <Send size={18} />
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}
