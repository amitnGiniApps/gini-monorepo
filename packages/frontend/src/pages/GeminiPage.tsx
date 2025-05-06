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
        <Page className="items-center bg-gradient-to-r from-[#F7F7F7] via-[#F5F8F2] to-[#F7F7F7] text-gray-800">

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
                        Welcome to Gini-AI
                    </motion.p>

                    <motion.div className="mt-10 space-y-6" variants={slideInFromLeft}>
                        <motion.p
                            className="text-gray-700 text-[24px] max-w-md font-light italic leading-7"
                            variants={slideInFromLeft}
                        >
                            Start Your App with <span className="font-semibold text-black">Gini AI</span>. Bring It to
                            Life with <span className="font-semibold text-black">Us</span>.
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
                            initial={{opacity: 0, x: 40}}
                            animate={{opacity: 1, x: 0}}
                            transition={{duration: 1.1, ease: "easeInOut"}}
                        />

                        {imageLoaded && (
                            <motion.div
                                className="absolute -bottom-14 w-[620px] bg-white/60 text-gray-800 p-5 rounded-3xl shadow-2xl backdrop-blur-lg flex items-start gap-4"
                                initial={{opacity: 0, y: 20}}
                                animate={{opacity: 1, y: 0}}
                                transition={{duration: 0.8, ease: "easeInOut", delay: 0.3}}
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
