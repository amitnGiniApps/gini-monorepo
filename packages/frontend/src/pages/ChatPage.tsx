import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Copy } from 'lucide-react';

import Page from "./Page.tsx";
import ServicesGrid from "../components/Services.tsx";
import TeamCards from "../components/UsersCards.tsx";
import Customers from "../components/Companies.tsx";
import FlowChartCore from '../components/FlowCards.tsx';

import {Message} from '../types'

import botAvatar from '../assets/gini-avatar-9.png';
import chatBackground from '../assets/bg-4.png';
import userAvatar from '../assets/userAvatar1.png';
import giniBot from "../assets/gini-avatar-0.png";
import AppDiagnostic from "./AppDiagnostic.tsx";


const ChatPage = () => {
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<Message[]>([]);
    const [isTyping, setIsTyping] = useState(false);
    const [canStop, setCanStop] = useState(false);
    const [copiedMessageId, setCopiedMessageId] = useState<number | null>(null);
    const [diagnosticChat, setDiagnosticChat] = useState(false);


    const [sessionId, setSessionId]  = useState('')
    const intervalRef = useRef<NodeJS.Timeout | number>(0);
    const controllerRef = useRef<AbortController | null>(null);
    const bottomRef = useRef<HTMLDivElement | null>(null);

    const username = localStorage.getItem('userName')

    const requestChatSummary = async ()=>  {
        try {
            const response = await fetch('http://localhost:3020/create/summary', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ sessionId, username }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to generate summary');
            }

            console.log('✅ Summary generated:', data.message);
            return data;
        } catch (error) {
            console.error('❌ Error:', error);
            return null;
        }
    }

    const sendMessage = async (option: string) => {
        if (!input.trim() && option.length === 0) return;

        const userMessage = { user: input || option };
        setMessages((prev) => [...prev, userMessage]);
        setInput('');
        setIsTyping(true);
        setCanStop(true);

        if (controllerRef.current) controllerRef.current.abort();
        const controller = new AbortController();
        controllerRef.current = controller;

        try {
            const res = await fetch('http://localhost:3020/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: input || option, username, chatSessionId: sessionId }),
                signal: controller.signal
            });

            const data = await res.json();
            const reply = data.reply;
            setSessionId(data.chatSessionId)

            setTimeout(() => setIsTyping(false), 200);

            let i = 0;
            const botMessage: Message = { user: '', bot: '', box: data.box || false, type: data.type || '' };
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
        } catch (err: any) {
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
        if (controllerRef.current) controllerRef.current.abort();
        setIsTyping(false);
        setCanStop(false);
    };

    const handleBotMessageClick = (message: Message, index: number) => {
        if (message.bot) {
            navigator.clipboard.writeText(message.bot)
                .then(() => {
                    setCopiedMessageId(index);
                    setTimeout(() => setCopiedMessageId(null), 2000);
                })
                .catch((err) => {
                    console.error('Failed to copy message:', err);
                });
        }
    };

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isTyping]);

    useEffect(() => {
        setMessages([
            {
                bot: `Hello${username ? ` ${username}`: ''}, i'm Gino - Gini Intelligence Neuron Originator`,
            }
        ]);
    }, []);

    return (
        <Page className="bg-gradient-to-b from-[#f9fafb] to-[#e9ecf1]">
            <div className="bg-no-repeat bg-contain bg-bottom" style={{ flex: '0.5', alignSelf: 'stretch', backgroundImage: `url(${giniBot})` }}>
                <AnimatePresence>
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.7 }}
                        className="flex flex-wrap gap-3 px-6 pt-6"
                    >
                        {[
                            'Show me Gini Lead Team', 'Our Clients',
                            'See Services list', 'Website Health Check', 'Project Flow', 'View Ai Template Projects'
                        ].map((suggestion, i) => (
                            <motion.button
                                key={`suggestion-${i}`}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.3, delay: i * 0.1 }}
                                onClick={() => {
                                    if (suggestion === 'Website Health Check') {
                                        const diagnosticIntroMessage: Message = {
                                            bot: 'Just enter your website URL and we’ll check for issues with UX, accessibility, speed, security, SEO, and more.',
                                            type: 'diagnostic'
                                        };
                                        setMessages(prev => [...prev, diagnosticIntroMessage]);
                                    } else if (suggestion === 'Project Flow') {
                                        sendMessage('flow');
                                    } else {
                                        sendMessage(suggestion);
                                    }
                                }}
                                className="border border-gray-200 bg-white text-gray-800 px-4 py-2 text-xs text-center rounded-full shadow-sm backdrop-blur-sm cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-[1.05] hover:bg-gray-50"
                            >
                                {suggestion}
                            </motion.button>
                        ))}
                    </motion.div>
                </AnimatePresence>
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    initial={{ opacity: 0, y: 50, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, x: 100 }}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                    style={{ width: '600px', alignSelf: 'stretch', flex: '1 0 55%', height: 'auto' }}
                    className="w-[600px] h-[600px] max-h-[75vh] flex flex-col rounded-[12px] bg-blue-100 overflow-hidden z-40 mr-[20px]"
                >
                    <div style={{ backgroundImage: `url(${chatBackground})` }} className="relative flex-1 overflow-y-auto bg-no-repeat bg-contain bg-center">
                        <div className="relative z-10 px-4 space-y-2">
                            <AnimatePresence>
                            {messages.map((m, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: m.bot ? -50 : 50, scale: 0.95 }}
                                        animate={{ opacity: 1, x: 0, scale: 1 }}
                                        exit={{ opacity: 0, x: m.bot ? -50 : 50, scale: 0.95 }}
                                        transition={{ duration: 0.3, ease: 'easeOut' }}
                                        className={`flex flex-col ${m.bot ? 'items-start' : 'items-end'} gap-2`}
                                    >
                                        <div className={`flex items-end ${m.bot ? 'justify-start' : 'justify-end'} gap-2`}>
                                            {m.bot && <img src={botAvatar} alt="Bot" className="w-[60px] h-[60px] rounded-full" />}
                                            <div
                                                onClick={() => handleBotMessageClick(m, i)}
                                                className={`relative group cursor-pointer max-w-[50%] text-[14px] p-2 rounded-2xl mt-[20px] text-sm whitespace-pre-wrap leading-5 shadow-md ${m.bot ? 'bg-white text-left rounded-bl-none shadow-gray-400/10' : 'bg-blue-200 text-right rounded-br-none shadow-gray-400/90'}`}
                                            >
                                                <p>{m.bot ?? m.user}</p>
                                                {/* Copy Icon */}
                                                {m.bot && (
                                                    <div className="absolute bottom-[-25px] left-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                                        {copiedMessageId === i ? (
                                                            <div className="flex items-center text-black text-xs">
                                                                <Check size={20} />
                                                                <span className="ml-1">Copied</span>
                                                            </div>
                                                        ) : (
                                                            <Copy size={16} className="text-black" />
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                            {!m.bot && <img src={userAvatar} alt="User" className="w-[60px] h-[60px] rounded-full" />}
                                        </div>

                                        {/* ⬇️ ADD: Let's check button for diagnostic message */}
                                        {m.bot && m.type === 'diagnostic' && (
                                            <motion.button
                                                initial={{ opacity: 0, scale: 0.95 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ duration: 0.3, delay: 0.5 }}
                                                onClick={() => setDiagnosticChat(true)}
                                                className="ml-16 mt-4 px-6 py-3 text-sm font-medium rounded-full bg-black cursor-pointer  text-white shadow-md hover:shadow-xl hover:scale-[1.03] transition-all duration-300"
                                            >
                                                Let&apos;s check
                                            </motion.button>
                                        )}

                                        {/* Other component renders */}
                                        {m.bot && m.type === 'options' && (
                                            <div className="flex flex-wrap gap-4 mt-4 ml-16">
                                                <AnimatePresence>
                                                    {m.options?.map((option, j) => (
                                                        <motion.button
                                                            key={`other-${j}`}
                                                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                                            animate={{ opacity: 1, scale: 1, y: 0 }}
                                                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                                                            transition={{ duration: 0.6, delay: j * 0.2 }}
                                                            onClick={() => sendMessage(option)}
                                                            className="w-[150px] h-[100px] bg-white border border-gray-100 rounded-xl text-sm font-medium shadow-md hover:shadow-lg hover:bg-gray-100 transition-all flex items-center justify-center text-center px-4 py-2"
                                                        >
                                                            {option}
                                                        </motion.button>
                                                    ))}
                                                </AnimatePresence>
                                            </div>
                                        )}
                                        {m.bot && m.type === 'services' && <ServicesGrid contentType={m.type} />}
                                        {m.bot && m.type === 'projects' && <ServicesGrid contentType={m.type} />}
                                        {m.bot && m.type === 'team' && <TeamCards />}
                                        {m.bot && m.type === 'clients' && <Customers />}
                                        {m.bot && m.type === 'flow' && <FlowChartCore />}
                                    </motion.div>
                                ))}
                            </AnimatePresence>

                            {/* Diagnostic Modal */}
                            {diagnosticChat && (
                                <div
                                    className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center  justify-center z-50 mb-0"
                                    onClick={() => setDiagnosticChat(false)}
                                >
                                    <div
                                        onClick={(e) => e.stopPropagation()}
                                        className="flex flex-row justify-center hide-scrollbar items-start relative w-[50vw] h-[95vh] rounded-xl overflow-hidden"
                                    >
                                        <AppDiagnostic />
                                    </div>
                                </div>
                            )}

                            {isTyping && (
                                <motion.div key="typing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex justify-start pl-4">
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

                    <div className="px-6 py-4 bg-white flex items-center gap-3 shadow-inner">
                        <button
                            className="bg-blue-500 text-white px-6 py-2 text-sm font-medium rounded-full shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer"
                            onClick={() => requestChatSummary()}>
                            Summary
                        </button>
                        <input
                            className="flex-1 border border-gray-200 rounded-2xl px-5 py-2 text-sm bg-gray-50 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                            placeholder="Type a message..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && sendMessage('')}
                        />
                        <button className="bg-black text-white px-6 py-2 text-sm font-medium rounded-full shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer" onClick={() => sendMessage('')}>
                            Send
                        </button>
                        {canStop && (
                            <button className="text-sm text-gray-500 border border-gray-300 px-4 py-2 rounded-full hover:bg-gray-100 transition-all duration-200 cursor-pointer" onClick={stopResponse}>
                                Stop
                            </button>
                        )}
                    </div>
                </motion.div>
            </AnimatePresence>
        </Page>
    );
};

export default ChatPage;
