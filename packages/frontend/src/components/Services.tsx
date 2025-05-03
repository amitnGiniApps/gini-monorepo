import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import LoginPageReviewer from "../pages/LoginPageReviewer.tsx";


const utilList = {
    projects:[
        { name: "Map", description: "Frontend & backend", link: "map1" },
        { name: "Map", description: "iOS & Android", link: "map2" },
        { name: "Chat", description: "Infrastructure", link: "chat-conversation-1" },
        { name: "Chat", description: "User-focused design", link: "chat-conversation-2" },
        { name: "Dashboard", description: "AI & ML tools", link: "dashboard-1" },
        { name: "Music App", description: "AI & ML tools", link: "music" },
        { name: "Tracking Map", description: "Expert strategy support", link: "track" }
    ],
    services: [
        { name: "AI Projects Templates & Ideas", description: "Frontend & backend", link: "projects" },
        { name: "Documents creation", description: "iOS & Android", link: "document" },
        { name: "Online app checker", description: "Infrastructure", link: "diagnostic" },
        { name: "Gini information", description: "User-focused design", link: "/services/design" },
    ]
}

const ServicesGrid = ({contentType}:{contentType:string}) => {
    const contentList = utilList[contentType]
    const radius = 120;
    const center = 100;
    const hourAngles = [180, 240, 300, 0, 60, 120, 90, 270];

    const [visibleCards, setVisibleCards] = useState(0);
    const [loading, setLoading] = useState(false);
    const [htmlContent, setHtmlContent] = useState<string | null>(null);
    const [diagnostic, setDiagnostic] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            setVisibleCards((prev) => {
                if (prev < contentList.length) return prev + 1;
                clearInterval(interval);
                return prev;
            });
        }, 150);
        return () => clearInterval(interval);
    }, [contentList.length]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setHtmlContent(null);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const fetchBoxData = async (link) => {
        setHtmlContent(null);
        setLoading(true);

        await new Promise((resolve) => setTimeout(resolve, 2000));

        try {
            const url = `http://localhost:3020/api/v1/generate/${link}`;
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

    const handleCardClick = (service) => {
        if(service.link === 'diagnostic') return setDiagnostic(true);

        fetchBoxData(service.link).then();
    };

    const cardClass =
        "group absolute w-[180px] h-[60px] p-4 flex flex-col justify-center items-center gap-1 rounded-2xl border border-gray-200 bg-white transition-all duration-300 text-center text-xs shadow-sm hover:shadow-xl hover:scale-[1.05] hover:bg-gray-50 backdrop-blur-sm cursor-pointer";

    return (
        <div className="flex mb-[60px] items-center h-auto justify-center relative m-auto my-[30px]">
            {/* Loading Overlay */}
            {loading && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="flex flex-col items-center">
                        <div className="relative w-16 h-16">
                            <div className="absolute inset-0 rounded-full border-2 border-gray-300"></div>
                            <div className="absolute inset-0 rounded-full border-t-2 border-gray-100 animate-spin"></div>
                        </div>
                        <p className="mt-4 text-base text-white font-medium">Please wait...</p>
                    </div>
                </div>
            )}

            {/* HTML iframe Popup */}
            {htmlContent && (
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
                    onClick={() => setHtmlContent(null)}
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="relative w-[90vw] h-[90vh] bg-transparent rounded-xl shadow-xl overflow-hidden flex justify-center "
                    >
                        <iframe
                            title="Generated HTML"
                            srcDoc={htmlContent}
                            className="w-full h-full border-none"
                            style={{ borderRadius: "inherit" }}
                        />
                    </div>
                </div>
            )}

            {/* Website Diagnostic Popup */}
            {diagnostic && (
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
                    onClick={() => setDiagnostic(null)}
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="flex flex-row justify-center hide-scrollbar items-start relative w-[50vw] h-[95vh] rounded-xl shadow-xl overflow-hidden"
                    >
                       <LoginPageReviewer/>
                    </div>
                </div>
            )}

            {/* Service Cards */}
            <div className="relative w-[400px] h-[300px]">
                {contentList.slice(0, visibleCards).map((service, index) => {
                    const isCenter = index === 8;
                    const x = isCenter ? center : center + radius * Math.cos((hourAngles[index % hourAngles.length] * Math.PI) / 180);
                    const y = isCenter ? center : center + radius * Math.sin((hourAngles[index % hourAngles.length] * Math.PI) / 180);

                    let adjustedX = x;
                    let adjustedY = y;
                    const deg = hourAngles[index % hourAngles.length];

                    if (!isCenter) {
                        if (deg === 0 || deg === 60 || deg === 300) adjustedX += 60;
                        if (deg === 120 || deg === 180 || deg === 240) adjustedX -= 60;
                        if (deg === 90) adjustedY += 70;
                        if (deg === 270) adjustedY -= 70;
                    }

                    return (
                        <motion.div
                            key={index}
                            onClick={() => handleCardClick(service)}
                            className={cardClass}
                            style={{ left: adjustedX, top: adjustedY, transform: 'translate(-50%, -50%)' }}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.4 }}
                        >
                            <h3 className="text-sm font-medium text-gray-800 mb-1">{service.name}</h3>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
};

export default ServicesGrid;
