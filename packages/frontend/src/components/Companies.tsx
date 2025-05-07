import { motion } from "framer-motion";
import { useEffect, useState } from "react";

import cloudinary from '../assets/companies/cloudinary.svg'
import grivo from '../assets/companies/grivo.svg'
import lotter from '../assets/companies/lotter.svg'
import one from '../assets/companies/one.svg'
import rivo from '../assets/companies/rivo.svg'
import tarya from '../assets/companies/tarya.svg'
import mathway from '../assets/companies/mathway.svg'
import playbuzz from '../assets/companies/playbuzz.svg'
import playstudio from '../assets/companies/playstudio.svg'
import onezero from '../assets/companies/onezero.svg'

const companies = [
    { name: "Apple", logo: cloudinary},
    { name: "Google", logo: grivo },
    { name: "Microsoft", logo: lotter },
    { name: "Amazon", logo: one },
    { name: "Tesla", logo: rivo },
    { name: "Meta", logo: tarya },
    { name: "Meta", logo:  mathway},
    { name: "Meta", logo:  playbuzz},
    { name: "Meta", logo:  playstudio},
    { name: "Meta", logo:  onezero}
];

const cardVariants = {
    hidden: () => ({
        opacity: 0,
        x: 0,
        y: 0,
        scale: 0.5,
    }),
    visible: (i: number) => ({
        opacity: 1,
        x: 0,
        y: 0,
        scale: 1,
        transition: {
            delay: i * 0.2,
            duration: 0.9,
            ease: "easeOut"
        },
    }),
};

// Honeycomb layout positions
const positions = [
    { x: 0, y: 0 },
    { x: 110, y: -64 },
    { x: 110, y: 64 },
    { x: -110, y: -64 },
    { x: -110, y: 64 },
    { x: 0, y: 128 },
    { x: 220, y: 0 },
    { x: -220, y: 0 },
    { x: -220, y: 128 },
    { x: 220, y: 128 },
];

const Customers=()=> {
    const [showCards, setShowCards] = useState(false);

    useEffect(() => {
        const timeout = setTimeout(() => setShowCards(true), 300);
        return () => clearTimeout(timeout);
    }, []);

    return (
        <div className="relative w-full h-[300px] overflow-hidden backdrop-blur-[1px]">
            {companies.map((company, index) => {
                const { x, y } = positions[index % positions.length];

                return (
                    <motion.div
                        key={`${company.name}-${index}`}
                        custom={index}
                        initial="hidden"
                        animate={showCards ? "visible" : "hidden"}
                        variants={cardVariants}
                        className="absolute flex flex-col items-center justify-center"
                        style={{
                            left: `calc(40% + ${x}px)`,
                            top: `calc(24% + ${y}px)`,
                            transform: 'translate(-50%, 0%)'
                        }}
                    >
                        <div className="w-33 h-24 rounded-2xl bg-white  border-transparent shadow-sm  transition-all duration-300 delay-100
                            dark:border-zinc-700 shadow-lg flex items-center justify-center p-2 hover:shadow-xl hover:z-10 transition-all">
                        <img src={company.logo} alt={company.name} className="w-full h-full object-contain"/>
                    </div>

            </motion.div>
            )
                ;
            })}
        </div>
    );
}

export default Customers;
