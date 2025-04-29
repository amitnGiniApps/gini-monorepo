import { motion } from 'framer-motion';
import { useTypingEffect } from "../hooks/useTypingEffect.tsx";
import {useEffect, useState} from "react";
import Page from "./Page.tsx";
import {landingPageSlides} from "../constant";
import giniAvatar from '../assets/gini-avatar-5.png'

const fadeUpCard = {
    hidden: { opacity: 0, y: 40, scale: 0.95 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            duration: 0.8,
            ease: 'easeOut',
        },
    },
};

const captionFadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: 'easeOut', delay: 0.4 },
    },
};

function GeminiPage() {

    const [currentSlide, setCurrentSlide] = useState(0);
    const [imageLoaded, setImageLoaded] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            setImageLoaded(false); // trigger fade-out
            setCurrentSlide((prev) => (prev + 1) % landingPageSlides.length);
        }, 20000);

        return () => clearInterval(interval);
    }, []);


    const typedText = useTypingEffect(
        landingPageSlides[currentSlide].description,
        40,
        1200 // delay after mount
    );

    return (
        <Page className='items-start'>
            <div className="w-full text-white font-roboto flex justify-between p-16 gap-24">
                <div className="flex-1 pr-10 text-left w-72">
                    <h1 className="text-6xl bg-gradient-to-r from-green-400 to-blue-700 bg-clip-text text-transparent m-0">Gini
                        AI</h1>
                    <p className="text-2xl mt-2">Welcome to Gini-Apps</p>
                    <p className="text-base text-gray-400 mt-2">
                        Your trusted development company where innovation, excellence, and a personal touch join forces
                        to bring your digital product to life.
                    </p>
                    <button
                        className="mt-8 px-6 py-3 bg-green-600 rounded-lg text-white text-lg cursor-pointer hover:shadow-x hover:bg-green-700 duration-200 transition"
                    >
                        Generate your site
                    </button>
                </div>
                <motion.div
                    key={currentSlide}
                    className="flex-1 flex flex-col items-center transform-origin-bottom relative"
                    variants={fadeUpCard}
                    initial="hidden"
                    animate="visible"
                >
                    <motion.img
                        src={landingPageSlides[currentSlide].image}
                        alt="Futuristic visual"
                        className="w-full rounded-3xl object-cover shadow-2xl max-w-[450px]"
                        variants={fadeUpCard}
                        initial="hidden"
                        animate="visible"
                        onLoad={() => setTimeout(() => setImageLoaded(true), 400)}
                    />
                    {imageLoaded && (
                        <motion.div
                            className="absolute bg-[#3a3636] p-4 rounded-2xl mt-[-10px] mx-auto w-96 flex items-start shadow-lg text-left z-20 -bottom-8"
                            variants={captionFadeUp}
                            initial="hidden"
                            animate="visible"
                        >
                            <img
                                src={giniAvatar}
                                alt="User avatar"
                                className="w-10 h-10 rounded-full mr-3 shrink-0"
                            />
                            <span className="font-mono text-sm text-gray-100 whitespace-pre-wrap">
                                {typedText}
                            </span>
                        </motion.div>
                    )}
                </motion.div>
            </div>
        </Page>
    );
}

export default GeminiPage;
