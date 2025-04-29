import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import bg from '../assets/cover.avif';
import userAvatar from '../assets/userAvatar1.png';
import botAvatar from '../assets/gini-avatar-9.png';

interface Message {
    user: string;
    bot?: string;
    box?: boolean;
}

const Chat = () => {
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<Message[]>([]);
    const [isTyping, setIsTyping] = useState(false);
    const [canStop, setCanStop] = useState(false);

    const [htmlContent, setHtmlContent] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const intervalRef = useRef<NodeJS.Timeout | number>(0);
    const controllerRef = useRef<AbortController | null>(null);
    const bottomRef = useRef<HTMLDivElement | null>(null);

    const sendMessage = async () => {
        if (!input.trim()) return;

        const userMessage = { user: input };
        setMessages((prev) => [...prev, userMessage]);
        setInput('');
        setIsTyping(true);
        setCanStop(true);

                if (controllerRef.current) controllerRef?.current?.abort();
        const controller = new AbortController();
        controllerRef.current = controller;

        try {
            const res = await fetch('http://localhost:3020/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: input }),
                signal: controller.signal
            });

            const data = await res.json();
            const reply = data.reply;

            setTimeout(() => setIsTyping(false), 200);

            let i = 0;
            const botMessage: Message = { user: '', bot: '', box: data.box || false };
            setMessages((prev) => [...prev, botMessage]);

            intervalRef.current = window.setInterval(() => {
                setMessages((prev) => {
                    const updated = [...prev];
                    updated[updated.length - 1].bot = reply.slice(0, i);
                    return updated;
                });
                i++;
                if (i > reply.length) {
                    window.clearInterval(intervalRef.current as number);
                    setCanStop(false);
                }
            }, 20);
        } catch (err: unknown) {
            if (err.name === 'AbortError') {
                setMessages((prev) => [...prev, { user: '', bot: 'Response stopped by user.' }]);
            } else {
                console.error(err);
                setMessages((prev) => [...prev, { user: '', bot: 'Failed to get response from server.' }]);
            }
            setIsTyping(false);
            setCanStop(false);
        }
    };

    const stopResponse = () => {
        if (intervalRef.current) clearInterval(intervalRef.current as number);
        if (controllerRef.current) controllerRef?.current?.abort();
        setIsTyping(false);
        setCanStop(false);
    };

    const handleBotMessageClick = (message: Message) => {
        const params = new URLSearchParams(location.search);

        if (message?.bot?.includes('Careers')) {
            params.set('page', 'careers');
        }
        if (message?.bot?.includes('Pini')) {
            params.set('highlight', 'pini');
        }

        const newUrl = `${location.pathname}?${params.toString()}`;
        window.history.replaceState({}, '', newUrl);
    };

    const fetchBoxData = async () => {
        setHtmlContent(null);
        setLoading(true);

        await new Promise((resolve) => setTimeout(resolve, 2000));

        try {
            const url = 'http://localhost:3020/api/v1/generate/track';
            const response = await fetch(url, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });

            if (response.ok) {
                const html = await response.text();
                setHtmlContent(html);
            } else {
                console.error("Error fetching HTML", response);
            }
        } catch (error) {
            console.error("Failed to generate HTML", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isTyping]);

    return (
        <div
            style={{
                width: '600px',
                alignSelf: 'stretch',
                flex: '1 0 55%',
                height:'auto'
            }}
            className="w-[600px] h-[600px] max-h-[90vh] flex flex-col rounded-[12px] bg-[#e7f0f9] shadow-xl shadow-black/10 overflow-hidden z-40"
        >
            {/* Loading Popup */}
            {loading && (
                <div
                    style={{
                        position: "fixed",
                        padding:20,
                        top: 0,
                        left: 0,
                        width: "100vw",
                        height: "100vh",
                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        overflow: "hidden",
                        zIndex: 1000,
                    }}
                >
                    <div className="spinner"></div>
                </div>
            )}

            {/* HTML iframe Popup */}
            {htmlContent && (
                <div
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        width: "100vw",
                        height: "100vh",
                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        overflow: "hidden",
                        zIndex: 1000,
                    }}
                >
                    <div
                        onClick={() => setHtmlContent(null)}
                        style={{
                            position: "relative",
                            display: "flex",
                            justifyContent: "center",
                            alignItems:'center',
                            width: "100%",
                            height: "100%",
                            backgroundColor: "transparent",
                            borderRadius: "12px",
                            overflow: "hidden",
                            padding: "0 100px",
                        }}
                    >
                        <iframe
                            title="Generated HTML"
                            srcDoc={htmlContent}
                            style={{
                                width: "1400px",
                                height: "800px",
                                border: "1px solid white",
                                // marginTop: "2rem",
                                borderRadius: "8px",
                                background: "white",
                                // marginTop:'300px',
                                // padding: "10px",
                                boxShadow: "0 8px 24px rgba(0, 0, 0, 0.25)",
                                overflow: "auto",   // <--- Important
                                overflowX: "hidden", // Optional: only scroll vertically
                                overflowY: "auto",
                            }}
                        />
                    </div>
                </div>
            )}

            {/* Messages Area */}
            <div
                style={{ backgroundImage: `url(${bg})` }}
                className="relative flex-1 overflow-y-auto bg-no-repeat bg-contain bg-top"
            >
                <div className="absolute inset-0 bg-green-100/20 z-0" />
                <div className="relative z-10 px-4 space-y-2">
                    <AnimatePresence>
                        {messages.map((m, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className={`flex flex-col ${m.bot ? 'items-start' : 'items-end'} gap-2`}
                            >
                                <div className="flex items-end gap-2">
                                    {/* Avatar */}
                                    {m.bot && (
                                        <img src={botAvatar} alt="Bot" className="w-[60px] h-[60px] rounded-full" />
                                    )}

                                    {/* Message */}
                                    <div
                                        onClick={() => handleBotMessageClick(m)}
                                        className={`max-w-[60%] text-[14px] p-2 rounded-2xl mt-[20px] text-sm whitespace-pre-wrap leading-5 shadow-md ${
                                            m.bot
                                                ? 'bg-gray-200 text-left rounded-bl-none shadow-gray-400/90'
                                                : 'bg-blue-200 text-right rounded-br-none shadow-gray-400/90'
                                        }`}
                                    >
                                        <p>{m.bot ?? m.user}</p>
                                    </div>

                                    {/* Avatar for User */}
                                    {!m.bot && (
                                        <img src={userAvatar} alt="User" className="w-[60px] h-[60px] rounded-full" />
                                    )}
                                </div>

                                {/* Fetch Box Data Button */}
                                {m.bot && m.box && (
                                    <button
                                        onClick={fetchBoxData}
                                        className="ml-[72px] mt-2 bg-blue-500 text-white text-xs px-4 py-1 rounded-full hover:bg-blue-600 transition"
                                    >
                                        Fetch Box Track Application
                                    </button>
                                )}
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {isTyping && (
                        <motion.div
                            key="typing"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex justify-start pl-4"
                        >
                            <div className="bg-gray-100 text-left rounded-2xl rounded-bl-none px-4 py-2 text-sm shadow-sm max-w-[80%]">
                                <div className="flex items-center gap-1">
                                    <span className="inline-block w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:.1s]" />
                                    <span className="inline-block w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:.2s]" />
                                    <span className="inline-block w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:.3s]" />
                                </div>
                            </div>
                        </motion.div>
                    )}
                    <div ref={bottomRef} />
                </div>
            </div>

            {/* Input Area */}
            <div className="px-6 py-4 bg-white flex items-center gap-3 shadow-inner">
                <input
                    className="flex-1 border border-gray-200 rounded-2xl px-5 py-2 text-sm bg-gray-50 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                    placeholder="Type a message..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                />
                <button
                    className="bg-green-600 text-white px-6 py-2 text-sm font-medium rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
                    onClick={sendMessage}
                >
                    Send
                </button>
                {canStop && (
                    <button
                        className="text-sm text-gray-500 border border-gray-300 px-4 py-2 rounded-full hover:bg-gray-100 transition-all duration-200"
                        onClick={stopResponse}
                    >
                        Stop
                    </button>
                )}
            </div>
        </div>
    );
};

export default Chat;
