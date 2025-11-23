import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { Send } from 'lucide-react';

export default function ChatInterface({ reportId }) {
    const { data: session } = useSession();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sending, setSending] = useState(false);
    const messagesEndRef = useRef(null);

    const fetchMessages = async () => {
        try {
            const res = await fetch(`/api/chats/${reportId}`);
            if (res.ok) {
                const data = await res.json();
                setMessages(data);
                setError(null);
            } else {
                throw new Error('Failed to load messages');
            }
        } catch (error) {
            console.error('Error fetching messages:', error);
            // Don't set error on poll failure to avoid flickering, only on initial load if needed
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setLoading(true);
        fetchMessages();
        const interval = setInterval(fetchMessages, 3000); // Poll every 3s
        return () => clearInterval(interval);
    }, [reportId]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const sendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || sending) return;

        setSending(true);
        try {
            const res = await fetch(`/api/chats/${reportId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: newMessage }),
            });

            if (res.ok) {
                setNewMessage('');
                fetchMessages();
            } else {
                const data = await res.json();
                alert(`Failed to send: ${data.message}`);
            }
        } catch (error) {
            console.error('Error sending message:', error);
            alert('Error sending message');
        } finally {
            setSending(false);
        }
    };

    if (loading && messages.length === 0) {
        return <div className="h-[500px] flex items-center justify-center border rounded-lg bg-gray-50">Loading chat...</div>;
    }

    return (
        <div className="flex flex-col h-full bg-white">
            <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
                {messages.length === 0 && !loading && (
                    <div className="text-center mt-10">
                        <p className="text-gray-400 text-sm">No messages yet.</p>
                        <p className="text-gray-500 font-medium">Start the conversation!</p>
                    </div>
                )}
                {messages.map((msg, idx) => {
                    const isMe = msg.senderId === session?.user?.id;
                    return (
                        <div key={idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                            <div className={`flex flex-col max-w-[75%] ${isMe ? 'items-end' : 'items-start'}`}>
                                <div
                                    className={`px-5 py-3 rounded-2xl shadow-sm text-sm leading-relaxed ${isMe
                                        ? 'bg-primary-600 text-white rounded-br-none'
                                        : 'bg-gray-100 text-gray-800 rounded-bl-none'
                                        }`}
                                >
                                    {msg.text}
                                </div>
                                <span className="text-[10px] text-gray-400 mt-1 px-1">
                                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>

            <form onSubmit={sendMessage} className="p-4 border-t border-gray-100 bg-white flex gap-3 items-center">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    disabled={sending}
                    className="flex-1 px-5 py-3 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all bg-gray-50 focus:bg-white disabled:opacity-50"
                />
                <button
                    type="submit"
                    disabled={!newMessage.trim() || sending}
                    className="p-3 bg-primary-600 text-white rounded-full hover:bg-primary-700 transition-all shadow-lg shadow-primary-600/20 disabled:opacity-50 disabled:shadow-none transform hover:scale-105 active:scale-95"
                >
                    <Send size={20} />
                </button>
            </form>
        </div>
    );
}
