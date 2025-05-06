
import { motion } from "framer-motion";
import { Linkedin } from "lucide-react";

import tamir from "../assets/tamir.png";
import shay from "../assets/shay.png";
import eran from "../assets/eran.png";
import gil from "../assets/gil.png";
import gal from "../assets/gal.png";
import dikla from "../assets/dikla.png";
import margie from "../assets/margie.png";
import muli from "../assets/muli.png";
import nofar from "../assets/nofar.png";
import adi from "../assets/adi.png";

const services = [
    {
        name: "Shay Somech",
        title: "Co-founder and CEO",
        description: "Drives strategy, innovation, and product vision.",
        avatar: shay,
        linkedin: "https://www.linkedin.com/in/shay-somech-27299b17/",
    },
    {
        name: "Tamir Avrahamov",
        title: "Co-founder and CEO",
        description: "Leads growth, partnerships, and operations.",
        avatar: tamir,
        linkedin: "https://www.linkedin.com/in/tamir-avrahamov-239754208/",
    },
    {
        name: "Eran Price",
        title: "CFO",
        description: "Oversees financial planning and strategy.",
        avatar: eran,
        linkedin: "https://www.linkedin.com/in/eran-price-b299b7a8/",
    },
    {
        name: "Gal Ben-Galim",
        title: "VP Sales",
        description: "Builds relationships and drives revenue.",
        avatar: gal,
        linkedin: "https://www.linkedin.com/in/gal-ben-galim-061194139/",
    },
    {
        name: "Gil Samara",
        title: "VP of R&D",
        description: "Leads tech innovation and engineering.",
        avatar: gil,
        linkedin: "https://www.linkedin.com/in/gil-samara-6936a01a9/",
    },
    {
        name: "Dikla Oren",
        title: "VP Human Resources",
        description: "Shapes culture and leads HR strategy.",
        avatar: dikla,
        linkedin: "https://www.linkedin.com/in/diklashabi/",
    },
    {
        name: "Margie Zylbersztejn",
        title: "Head of Marketing & Business Development",
        description: "Drives brand growth and partnerships.",
        avatar: margie,
        linkedin: "https://www.linkedin.com/in/margie-zylbersztejn-%F0%9F%8E%97%EF%B8%8F-717726202/",
    },
    {
        name: "Muli Cohen",
        title: "Head of Full-Stack Development",
        description: "Leads full-stack teams and solutions.",
        avatar: muli,
        linkedin: "https://www.linkedin.com/in/muli-cohen-32ab1515b/",
    },
    {
        name: "Nofar Atari Levy",
        title: "Head of Design",
        description: "Shapes UX and brand identity.",
        avatar: nofar,
        linkedin: "https://www.linkedin.com/in/nofar-atari-0352a0194/",
    },
    {
        name: "Adi Galili",
        title: "Design Director",
        description: "Leads visual design and aesthetics.",
        avatar: adi,
        linkedin: "https://www.linkedin.com/in/adi-galili-25639914/",
    },
];

const containerVariants = {
    hidden: {},
    show: {
        transition: {
            staggerChildren: 0.1,
        },
    },
};

const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    show: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5,
            ease: "easeOut",
        },
    },
};

export const TeamCards = () => {
    return (
        <div className="w-full px-4 py-10">
            <motion.div
                className="flex flex-wrap justify-center gap-4 max-w-6xl mx-auto items-stretch"
                variants={containerVariants}
                initial="hidden"
                animate="show"
            >
                {services.map((person, index) => (
                    <motion.div
                        key={index}
                        className="relative w-[200px] h-[200px]"
                        variants={cardVariants}
                    >
                        <motion.div
                            className="group absolute inset-0 bg-white rounded-2xl shadow-sm flex flex-col justify-between items-center text-center p-3 cursor-default transition-transform duration-300 transform-gpu will-change-transform hover:scale-[1.1] z-10"
                        >
                            <div className="flex flex-col items-center">
                                <img
                                    src={person.avatar}
                                    alt={person.name}
                                    className="w-12 h-12 rounded-full object-cover mb-2"
                                />
                                <h4 className="text-sm font-semibold text-[#1D1D1F]">
                                    {person.name}
                                </h4>
                                <p className="text-xs text-[#6E6E73] mt-0.5">
                                    {person.title}
                                </p>
                                <p className="text-[11px] px-3 leading-snug text-[#6e6e73] overflow-hidden line-clamp-3 group-hover:line-clamp-none transition-all duration-300 max-h-[4.5em] group-hover:max-h-[500px]">
                                    {person.description}
                                </p>
                            </div>

                            <motion.a
                                href={person.linkedin}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800"
                                whileTap={{ scale: 0.9, rotate: -10 }}
                                transition={{ type: "spring", stiffness: 300 }}
                            >
                                <Linkedin className="w-4 h-4 cursor-pointer" />
                            </motion.a>
                        </motion.div>
                    </motion.div>
                ))}
            </motion.div>
        </div>
    );
};

export default TeamCards;
