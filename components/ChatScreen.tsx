import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const ChatScreen: React.FC = () => {
    const navigate = useNavigate();
    const [messages, setMessages] = useState([
        { id: 1, sender: 'other', text: "Hi! Thanks for checking out my drill.", time: "10:30 AM" },
        { id: 2, sender: 'other', text: "It comes with two fully charged batteries. Let me know if you have any questions!", time: "10:31 AM" }
    ]);
    const [inputText, setInputText] = useState("");
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputText.trim()) return;

        const newMessage = {
            id: messages.length + 1,
            sender: 'me',
            text: inputText,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages([...messages, newMessage]);
        setInputText("");

        // Simulate reply
        setTimeout(() => {
             setMessages(prev => [...prev, {
                id: prev.length + 1,
                sender: 'other',
                text: "Sounds good! Feel free to book whenever you're ready.",
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
             }]);
        }, 2000);
    };

    return (
        <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-white h-full flex flex-col animate-fade-in relative">
            {/* Header */}
            <div className="flex items-center px-4 py-3 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-sm z-10">
                <button onClick={() => navigate(-1)} className="mr-3 size-10 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                    <span className="material-symbols-outlined">arrow_back</span>
                </button>
                <div className="relative">
                    <div className="size-10 rounded-full bg-slate-200 bg-cover bg-center" style={{backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCQCnxcTiY5nKrKkYNtVae8ksL-Qvss7nooNMjfbB1JM2WRRrZjWNpbS7cixDmYPOSqUqORPLNIdJ7kC14bNjFIrhkBoNwBpRxo36Yhu5IIz0BGr-rMAm66_afFSyL9jwTP7-ie9g5puePG7KgMTLX9wF16_0uYkWPaO2tbZj3unr6_CyepmSQOxPbDFSRynQqNoHDOSMLa5GNcXNHMZgNWyDMjwLyJjlfNe2A6IUYwSfdDn4nBHipdRTLKZMtnPD_5GjNkhwDcD66h')"}}></div>
                    <div className="absolute bottom-0 right-0 size-3 rounded-full bg-green-500 border-2 border-white dark:border-slate-900"></div>
                </div>
                <div className="ml-3">
                    <h3 className="font-bold text-sm leading-tight">Sarah M.</h3>
                    <p className="text-xs text-slate-500">Online now</p>
                </div>
                <button className="ml-auto p-2 text-primary">
                    <span className="material-symbols-outlined">call</span>
                </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#f0f2f5] dark:bg-[#0b141a]">
                <div className="text-center text-xs text-slate-400 my-4">Today</div>
                {messages.map(msg => (
                    <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[75%] px-4 py-2 rounded-2xl text-sm leading-relaxed shadow-sm relative ${
                            msg.sender === 'me' 
                            ? 'bg-primary text-white rounded-br-none' 
                            : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-bl-none'
                        }`}>
                            {msg.text}
                            <span className={`text-[10px] block text-right mt-1 opacity-70`}>{msg.time}</span>
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSend} className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2 safe-area-pb">
                <button type="button" className="p-2 text-slate-400 hover:text-primary transition-colors">
                    <span className="material-symbols-outlined">add_circle</span>
                </button>
                <input 
                    type="text" 
                    value={inputText} 
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Type a message..." 
                    className="flex-1 bg-slate-100 dark:bg-slate-800 border-none rounded-full px-4 py-2.5 text-sm focus:ring-1 focus:ring-primary"
                />
                <button 
                    type="submit" 
                    disabled={!inputText.trim()}
                    className={`p-2 rounded-full transition-all ${inputText.trim() ? 'text-primary bg-primary/10' : 'text-slate-300'}`}
                >
                    <span className="material-symbols-outlined">send</span>
                </button>
            </form>
        </div>
    );
};

export default ChatScreen;