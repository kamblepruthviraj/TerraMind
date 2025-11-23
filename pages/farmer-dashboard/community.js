import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import Navbar from '@/components/Navbar';
import { Send, User, Clock, MessageSquare } from 'lucide-react';

export default function CommunityChat() {
    const { data: session } = useSession();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [sending, setSending] = useState(false);
    const messagesEndRef = useRef(null);

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
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
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
        <div className="min-h-screen bg-gray-50 font-sans flex flex-col">
            <Navbar />

            <main className="flex-1 max-w-5xl mx-auto w-full p-4 sm:p-6 lg:p-8 flex flex-col h-[calc(100vh-64px)]">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col flex-1 overflow-hidden">

                    {/* Header */}
                    <div className="p-4 sm:p-6 border-b border-gray-100 bg-primary-50/30 flex items-center gap-3">
                        <div className="p-2 bg-primary-100 rounded-lg text-primary-600">
                            <MessageSquare size={24} />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-gray-900">Community Chat</h1>
                            <p className="text-sm text-gray-500">Connect with other farmers (Updates every 3s)</p>
                        </div>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-gray-50/30 custom-scrollbar">
                        {messages.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-gray-400 space-y-2">
                                <MessageSquare size={48} className="opacity-20" />
                                <p>No messages yet. Be the first to say hello!</p>
                            </div>
                        ) : (
                            messages.map((msg) => {
                                const isOwnMessage = session?.user?.id === msg.senderUid;
                                return (
                                    <div
                                        key={msg._id}
                                        className={`flex flex-col ${isOwnMessage ? 'items-end' : 'items-start'}`}
                                    >
                                        <div className={`flex items-end gap-2 max-w-[80%] sm:max-w-[70%] ${isOwnMessage ? 'flex-row-reverse' : 'flex-row'}`}>
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${isOwnMessage ? 'bg-primary-100 text-primary-600' : 'bg-gray-200 text-gray-600'}`}>
                                                <User size={16} />
                                            </div>

                                            <div className={`p-3 sm:p-4 rounded-2xl shadow-sm ${isOwnMessage
                                                    ? 'bg-primary-600 text-white rounded-tr-none'
                                                    : 'bg-white border border-gray-100 text-gray-800 rounded-tl-none'
                                                }`}>
                                                {!isOwnMessage && (
                                                    <p className="text-xs font-bold text-primary-600 mb-1">{msg.senderName}</p>
                                                )}
                                                <p className="text-sm sm:text-base leading-relaxed whitespace-pre-wrap break-words">{msg.text}</p>
                                            </div>
                                        </div>
                                        <span className={`text-[10px] sm:text-xs text-gray-400 mt-1 flex items-center gap-1 ${isOwnMessage ? 'mr-10' : 'ml-10'}`}>
                                            <Clock size={10} />
                                            {formatTime(msg.timestamp)}
                                        </span>
                                    </div>
                                );
                            })
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="p-4 border-t border-gray-100 bg-white">
                        <form onSubmit={handleSendMessage} className="flex gap-2 sm:gap-4">
                            <input
                                type="text"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                placeholder="Type your message..."
                                className="flex-1 rounded-xl border-gray-200 shadow-sm focus:border-primary-500 focus:ring-primary-500 p-3 sm:p-4 text-sm sm:text-base transition-all bg-gray-50 focus:bg-white"
                                disabled={sending}
                            />
                            <button
                                type="submit"
                                disabled={sending || !newMessage.trim()}
                                className="bg-primary-600 text-white p-3 sm:p-4 rounded-xl hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-primary-600/20 flex items-center justify-center min-w-[50px] sm:min-w-[60px]"
                            >
                                {sending ? (
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                ) : (
                                    <Send size={20} />
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    );
}
