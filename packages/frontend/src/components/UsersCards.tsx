import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { Linkedin } from "lucide-react";

import tamir from '../assets/tamir.png'
import shay from '../assets/shay.png'
import muli from '../assets/muli.png'

const services = [
    {
        name: "Shay Somech",
        title: "Co-founder and CEO",
        description: "Visionary leader driving innovation and strategy with a strong background in product development and team leadership.",
        avatar: shay,
        link: "/profile/john",
        linkedin: "https://www.linkedin.com/in/shay-somech-27299b17/"
    },
    {
        name: "Tamir Avrahamov",
        title: "Co-founder and CEO",
        description: "Entrepreneurial leader focused on scaling operations and delivering high-impact solutions through strategic execution and innovation.",
        avatar: tamir,
        link: "/profile/jane",
        linkedin: "https://www.linkedin.com/in/tamir-avrahamov-239754208/"
    },
    {
        name: "Muli Cohen",
        title: "Head of Full-Stack Development",
        description: "Expert in full-stack engineering, leading cross-functional teams to build robust, scalable applications with modern web technologies.",
        avatar: muli,
        link: "/profile/mike",
        linkedin: "https://www.linkedin.com/in/muli-cohen-32ab1515b/"
    },
];

export const TeamCards=()=> {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <div className="px-4 py-10">
            <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
                <AnimatePresence>
                    {mounted && services.map((person, index) => (
                        <motion.div
                            key={index}
                            className="w-full max-w-sm mx-auto p-5 rounded-2xl border border-gray-200 bg-white shadow-sm hover:shadow-md hover:scale-[1.02] transition-all duration-200 backdrop-blur-sm flex flex-col items-start gap-4"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            transition={{ duration: 0.3, delay: index * 0.5}}
                        >
                            <div className="flex items-start gap-4 w-full">
                                <img src={person.avatar} alt="Avatar" className="w-13 h-13 rounded-full object-cover mt-1" />
                                <div className="flex flex-col flex-1">
                                    <h4 className="text-base  text-left font-semibold text-gray-900 mb-0.5">{person.name}</h4>
                                    <p className="text-xs text-left text-gray-500 mb-2">{person.title}</p>
                                    <p className="text-sm text-gray-600 text-left leading-snug whitespace-pre-wrap mb-3">
                                        {person.description}
                                    </p>
                                    <div className="flex items-center gap-3">
                                        <a href={person.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:text-blue-900">
                                            <Linkedin className="w-5 h-5" />
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
}
export  default TeamCards;
