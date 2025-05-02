// import {useEffect, useState} from "react";
// import {useNavigate} from "react-router-dom";
// import { motion } from 'framer-motion';
//
// import Page from "./Page.tsx";
// import { useTypingEffect } from "../hooks/useTypingEffect.tsx";
// import {landingPageSlides} from "../constant";
// import giniAvatar from '../assets/gini-avatar-5.png'
//
// const fadeUpCard = {
//     hidden: { opacity: 0, y: 40, scale: 0.95 },
//     visible: {
//         opacity: 1,
//         y: 0,
//         scale: 1,
//         transition: {
//             duration: 0.8,
//             ease: 'easeOut',
//         },
//     },
// };
//
// const captionFadeUp = {
//     hidden: { opacity: 0, y: 20 },
//     visible: {
//         opacity: 1,
//         y: 0,
//         transition: { duration: 0.6, ease: 'easeOut', delay: 0.4 },
//     },
// };
//
// const GeminiPage = ()=>  {
//
//     const [currentSlide, setCurrentSlide] = useState(0);
//     const [imageLoaded, setImageLoaded] = useState(false);
//
//     const navigate = useNavigate();
//
//
//     useEffect(() => {
//         const interval = setInterval(() => {
//             setImageLoaded(false); // trigger fade-out
//             setCurrentSlide((prev) => (prev + 1) % landingPageSlides.length);
//         }, 20000);
//
//         return () => clearInterval(interval);
//     }, []);
//
//
//     const typedText = useTypingEffect(
//         landingPageSlides[currentSlide].description,
//         40,
//         1200 // delay after mount
//     );
//
//     return (
//         <Page className='items-start'>
//             <div className="w-full text-gray-400 text-white font-roboto flex justify-between p-16 gap-24">
//                 <div className="flex-1 pr-10 text-left w-72">
//                     <h1 className="text-6xl bg-gradient-to-r from-green-400 to-blue-700 bg-clip-text text-transparent m-0">Gini
//                         AI</h1>
//                     <p className="text-2xl mt-2">Welcome to Gini-Apps</p>
//                     <p className="text-base text-gray-400 mt-2">
//                         Start Your App with Gini AI.
// "Start Your App with Gini AI. Bring It to Life with Us."
//
//                         <p>to bring your digital product to life.</p>
//
//                     </p>
//                     <button
//                         onClick={() => navigate('/gini-ai')}
//                         className="mt-8 px-6 py-3 bg-green-600 rounded-lg text-white text-left text-lg cursor-pointer hover:shadow-x hover:bg-green-700 duration-200 transition"
//                     >
//                     Let's Start
//                     </button>
//                 </div>
//                 <motion.div
//                     key={currentSlide}
//                     className="flex-1 flex flex-col items-center transform-origin-bottom relative"
//                     variants={fadeUpCard}
//                     initial="hidden"
//                     animate="visible"
//                 >
//                     <motion.img
//                         src={landingPageSlides[currentSlide].image}
//                         alt="Futuristic visual"
//                         className="w-full rounded-3xl object-cover shadow-2xl max-w-[450px]"
//                         variants={fadeUpCard}
//                         initial="hidden"
//                         animate="visible"
//                         onLoad={() => setTimeout(() => setImageLoaded(true), 400)}
//                     />
//                     {imageLoaded && (
//                         <motion.div
//                             className="absolute bg-[#3a3636] p-4 rounded-2xl mt-[-10px] mx-auto w-96 flex items-start shadow-lg text-left z-20 -bottom-8"
//                             variants={captionFadeUp}
//                             initial="hidden"
//                             animate="visible"
//                         >
//                             <img
//                                 src={giniAvatar}
//                                 alt="User avatar"
//                                 className="w-10 h-10 rounded-full mr-3 shrink-0"
//                             />
//                             <span className="font-mono text-sm text-gray-100 whitespace-pre-wrap">
//                                 {typedText}
//                             </span>
//                         </motion.div>
//                     )}
//                 </motion.div>
//             </div>
//         </Page>
//     );
// }
//
// export default GeminiPage;

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import Page from "./Page.tsx";
import { useTypingEffect } from "../hooks/useTypingEffect.tsx";
import { landingPageSlides } from "../constant";
import giniAvatar from "../assets/gini-avatar-5.png";

const containerVariants = {
    initial: {},
    animate: {
        transition: {
            staggerChildren: 0.25,
            delayChildren: 0.2,
        },
    },
};

const slideInFromLeft = {
    initial: { opacity: 0, x: -40 },
    animate: {
        opacity: 1,
        x: 0,
        transition: {
            duration: 1.0,
            ease: "easeInOut",
        },
    },
};

const slideInFromRight = {
    initial: { opacity: 0, x: 40 },
    animate: {
        opacity: 1,
        x: 0,
        transition: {
            duration: 1.0,
            ease: "easeInOut",
        },
    },
};

const GeminiPage = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [imageLoaded, setImageLoaded] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const interval = setInterval(() => {
            setImageLoaded(false);
            setCurrentSlide((prev) => (prev + 1) % landingPageSlides.length);
        }, 20000);
        return () => clearInterval(interval);
    }, []);

    const typedText = useTypingEffect(
        landingPageSlides[currentSlide].description,
        40,
        1000
    );

    return (
        <Page className="items-center bg-gradient-to-b from-[#f9fafb] to-[#e9ecf1] text-gray-800">
            <motion.div
                className="w-full max-w-7xl px-4 md:px-16 py-[10px] flex flex-col md:flex-row gap-16 justify-between self-start"
                variants={containerVariants}
                initial="initial"
                animate="animate"
            >
                {/* Left Section */}
                <motion.div className="flex-1 text-left self-center mb-[30px]" variants={slideInFromLeft}>
                    <h1 className="text-7xl font-semibold tracking-tight bg-gradient-to-r from-black to-gray-800 bg-clip-text text-transparent">
                        Gini AI
                    </h1>
                    <motion.p
                        className="text-base mt-6 text-gray-500 font-semibold uppercase tracking-widest"
                        variants={slideInFromLeft}
                    >
                        Welcome to Gini-Apps
                    </motion.p>

                    <motion.div className="mt-10 space-y-6" variants={slideInFromLeft}>
                        <motion.p
                            className="text-gray-700 text-[24px] max-w-md font-light italic leading-7"
                            variants={slideInFromLeft}
                        >
                            Start Your App with <span className="font-semibold text-black">Gini AI</span>. Bring It to Life with <span className="font-semibold text-black">Us</span>.
                        </motion.p>
                        <motion.button
                            onClick={() => navigate("/gini-ai")}
                            className="px-6 py-3 mt-[10px] text-white bg-black/80 rounded-xl hover:bg-black shadow-lg text-lg font-medium tracking-wide"
                            variants={slideInFromLeft}
                        >
                            Let’s Start
                        </motion.button>
                    </motion.div>
                </motion.div>

                {/* Right Section */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentSlide}
                        className="flex-1 relative flex flex-col items-center max-h-[500px]"
                        variants={slideInFromRight}
                        initial="initial"
                        animate="animate"
                        exit="initial"
                    >
                        <motion.img
                            src={landingPageSlides[currentSlide].image}
                            alt="Gini Visual"
                            className="w-full max-w-[500px] rounded-3xl shadow-2xl object-cover"
                            onLoad={() => setTimeout(() => setImageLoaded(true), 300)}
                            initial={{ opacity: 0, x: 40 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 1.1, ease: "easeInOut" }}
                        />

                        {imageLoaded && (
                            <motion.div
                                className="absolute -bottom-14 w-[620px] bg-white/60 text-gray-800 p-5 rounded-3xl shadow-2xl backdrop-blur-lg flex items-start gap-4"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, ease: "easeInOut", delay: 0.3 }}
                            >
                                <img
                                    src={giniAvatar}
                                    alt="Avatar"
                                    className="w-11 h-12 rounded-full shrink-0"
                                />
                                <span className="text-base font-mono whitespace-pre-wrap leading-relaxed">
                  {typedText}
                </span>
                            </motion.div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </motion.div>
        </Page>
    );
};

export default GeminiPage;


// import React from "react";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";
// import { CheckCircle, BarChart2, Search } from "lucide-react";
// import { motion } from "framer-motion";
//
// export default function LandingPage() {
//     return (
//         <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex flex-col">
//             <header className="flex justify-between items-center px-8 py-6 shadow-sm">
//                 <h1 className="text-2xl font-bold text-green-600">Gini AI</h1>
//                 <nav className="space-x-6 text-sm font-medium text-gray-600">
//                     <a href="#" className="hover:text-black">Features</a>
//                     <a href="#" className="hover:text-black">Pricing</a>
//                     <a href="#" className="hover:text-black">About</a>
//                     <Button className="bg-green-600 hover:bg-green-700 text-white">Sign Up</Button>
//                 </nav>
//             </header>
//
//             <main className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-10 px-12 py-16 items-center">
//                 <div>
//                     <h2 className="text-5xl font-extrabold text-green-600 mb-4">Gini AI</h2>
//                     <p className="text-lg text-gray-700 mb-6">Start Your App with Gini AI to bring your digital product to life.</p>
//                     <Button className="bg-green-600 hover:bg-green-700 text-white text-lg px-6 py-3">Let's Start</Button>
//                 </div>
//
//                 <motion.div
//                     initial={{ opacity: 0, y: 50 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     transition={{ duration: 0.6 }}
//                 >
//                     <Card className="shadow-lg p-6 rounded-2xl w-full max-w-md">
//                         <CardContent className="flex flex-col items-center">
//                             <div className="flex items-center space-x-4 mb-4">
//                                 <CheckCircle className="text-green-600" />
//                                 <BarChart2 className="text-green-600" />
//                             </div>
//                             <div className="w-full h-40 bg-gray-100 rounded-lg mb-6 flex justify-center items-center">
//                                 <Search className="text-gray-400 w-10 h-10" />
//                             </div>
//                             <div className="text-center text-sm text-gray-700">
//                                 <strong>AI Site Checker</strong> finds issues and boosts your website’s performance.
//                             </div>
//                         </CardContent>
//                     </Card>
//                 </motion.div>
//             </main>
//
//             <footer className="bg-green-600 text-white py-4 text-sm flex justify-between px-8">
//                 <p>© 2025 Gini AI. All rights reserved.</p>
//                 <div className="space-x-4">
//                     <a href="#" className="hover:underline">Privacy</a>
//                     <a href="#" className="hover:underline">Terms</a>
//                     <a href="#" className="hover:underline">Contact</a>
//                 </div>
//             </footer>
//         </div>
//     );
// }

//
// import React, { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";
// import { CheckCircle, BarChart2, Search } from "lucide-react";
// import { motion } from "framer-motion";
//
// export default function LandingPage() {
//     const [email, setEmail] = useState("");
//
//     const handleSubmit = (e: React.FormEvent) => {
//         e.preventDefault();
//         alert(`Subscribed with: ${email}`);
//     };
//
//     return (
//         <div className="min-h-screen bg-white text-gray-900 font-sans">
//             <header className="flex justify-between items-center px-10 py-6 border-b border-gray-200 backdrop-blur bg-white/80 sticky top-0 z-10">
//                 <motion.h1
//                     initial={{ opacity: 0, y: -10 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     transition={{ duration: 0.6 }}
//                     className="text-3xl font-semibold tracking-tight text-black">
//                     Gini AI
//                 </motion.h1>
//                 <nav className="space-x-8 text-sm font-medium">
//                     <a href="#" className="hover:text-black text-gray-600">Features</a>
//                     <a href="#" className="hover:text-black text-gray-600">Pricing</a>
//                     <a href="#" className="hover:text-black text-gray-600">About</a>
//                     <Button className="bg-black hover:bg-gray-900 text-white px-5 py-2 rounded-full transition">Sign Up</Button>
//                 </nav>
//             </header>
//
//             <main className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-12 px-16 py-24 items-center">
//                 <motion.div
//                     initial={{ opacity: 0, x: -30 }}
//                     animate={{ opacity: 1, x: 0 }}
//                     transition={{ duration: 0.6 }}
//                 >
//                     <h2 className="text-6xl font-semibold leading-tight text-black mb-6 tracking-tight">Gini AI</h2>
//                     <p className="text-xl text-gray-700 mb-8 max-w-lg">Start Your App with Gini AI and bring your digital product to life with elegance and efficiency.</p>
//
//                     <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md">
//                         <input
//                             type="email"
//                             required
//                             value={email}
//                             onChange={(e) => setEmail(e.target.value)}
//                             placeholder="Enter your email"
//                             className="px-5 py-3 rounded-full border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-black transition w-full"
//                         />
//                         <Button type="submit" className="bg-black hover:bg-gray-900 text-white text-lg px-6 py-3 rounded-full shadow-md transition">Get Started</Button>
//                     </form>
//                 </motion.div>
//
//                 <motion.div
//                     initial={{ opacity: 0, x: 30 }}
//                     animate={{ opacity: 1, x: 0 }}
//                     transition={{ duration: 0.6 }}
//                 >
//                     <Card className="shadow-2xl p-8 rounded-3xl w-full max-w-md bg-gray-50 border border-gray-200">
//                         <CardContent className="flex flex-col items-center">
//                             <div className="flex items-center space-x-6 mb-6">
//                                 <CheckCircle className="text-green-500 w-6 h-6" />
//                                 <BarChart2 className="text-green-500 w-6 h-6" />
//                             </div>
//                             <div className="w-full h-52 bg-gray-100 rounded-xl mb-6 flex justify-center items-center">
//                                 <Search className="text-gray-400 w-12 h-12" />
//                             </div>
//                             <div className="text-center text-sm text-gray-600 font-medium max-w-xs">
//                                 <strong className="text-black">AI Site Checker</strong> finds issues and boosts your website’s performance effortlessly.
//                             </div>
//                         </CardContent>
//                     </Card>
//                 </motion.div>
//             </main>
//
//             <footer className="bg-gray-100 text-gray-600 py-6 text-sm flex justify-between px-10 border-t border-gray-200">
//                 <p>© 2025 Gini AI. All rights reserved.</p>
//                 <div className="space-x-4">
//                     <a href="#" className="hover:underline">Privacy</a>
//                     <a href="#" className="hover:underline">Terms</a>
//                     <a href="#" className="hover:underline">Contact</a>
//                 </div>
//             </footer>
//         </div>
//     );
// }
//
