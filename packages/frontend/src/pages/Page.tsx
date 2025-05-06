import { ReactNode } from 'react';
import { useNavigate, useLocation } from "react-router-dom";

import instagram from '../assets/instagram.avif'
import linkedin from '../assets/linkedin.avif'
import facebook from '../assets/facenook.avif'
import favicon from '../assets/giniNewLogo.svg'

const Page = ({ children, className }: { children: ReactNode, className?: string }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const navLinkClass = (path: string) =>
        `px-3 py-1.5 rounded-md cursor-pointer ${
            location.pathname === path
                ? "bg-gray-200 text-black"
                : "hover:text-black"
        }`;

    return (
        <div className="flex flex-col min-h-screen bg-gray-50 relative shadow-white-400/100 overflow-hidden">
            <header className="bg-white border-b border-gray-100 shadow-sm px-6 py-4 flex items-center justify-between">
                <div onClick={() => navigate("/")} className="flex cursor-pointer items-center gap-2">
                    <img src={favicon} alt="gini logo" className=" h-[32px] rounded-full"/>
                </div>
                <nav className="hidden md:flex items-center gap-6 text-sm text-gray-600">
                    <a className={navLinkClass("/gini-ai")} onClick={() => navigate("/gini-ai")}>
                        Gino AI Bot
                    </a>
                    <a className={navLinkClass("/admin")} onClick={() => navigate("/admin")}>
                        Admin
                    </a>
                    <button onClick={() => navigate("/")}
                            className="bg-black text-white px-4 py-1.5 rounded-lg text-sm hover:opacity-90">
                        Sign Up
                    </button>
                </nav>
            </header>

            <main className={`flex flex-1 flex-row justify-center items-center py-4 pl-[4px] ${className}`}>
                {children}
            </main>

            <footer
                className="bg-gray-50 relative shadow-white-400/100 shadow z-20 text-sm flex flex-col items-center px-6 py-3 text-center">
                <div className="flex gap-6">
                    <a href="https://www.instagram.com/gini_apps.studio/" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                        <img src={instagram} className="w-[30px] h-[30px] rounded-full"/>
                    </a>
                    <a href="https://il.linkedin.com/company/gini-apps.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                        <img src={linkedin} className="w-[30px] h-[30px] rounded-full"/>
                    </a>
                    <a href="https://www.facebook.com/GiniApps/" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                        <img src={facebook} className="w-[30px] h-[30px] rounded-full"/>
                    </a>
                </div>
                <a href="https://www.gini-apps.com/blank-3" target="_blank" className="mt-2 mb-1 border-b-1 border-black">Terms of Use & Privacy Policy for this Website</a>
            </footer>

        </div>
    );
};

export default Page;
