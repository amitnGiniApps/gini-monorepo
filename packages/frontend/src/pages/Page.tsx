import { ReactNode } from 'react';

function Page({ children }: { children: ReactNode }) {
    return (
        <div className="flex flex-col min-h-screen bg-gray-50 relative shadow-white-400/100">
            <header className="bg-white relative shadow-md flex items-center justify-between px-6 py-4">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center font-bold text-lg">
                        G
                    </div>
                    <span className="text-xl font-bold text-gray-700">Gini AI</span>
                </div>
                <nav className="hidden md:flex items-center gap-6 text-sm text-gray-600">
                    <a href="#" className="hover:text-black">Features</a>
                    <a href="#" className="hover:text-black">Pricing</a>
                    <a href="#" className="hover:text-black">About</a>
                    <button className="bg-green-600 text-white px-4 py-1 rounded-lg text-sm">Sign Up</button>
                </nav>
            </header>

            <main className="flex flex-1 flex-row justify-between items-center py-4 pl-[4px] pr-5">
                {children}
            </main>

            <footer className="bg-green-600 text-white z-20 text-sm flex flex-col md:flex-row justify-between items-center px-6 py-4">
                <span>© 2025 Gini AI. All rights reserved.</span>
                <div className="flex gap-6 mt-2 md:mt-0">
                    <a href="#" className="hover:underline">Privacy</a>
                    <a href="#" className="hover:underline">Terms</a>
                    <a href="#" className="hover:underline">Contact</a>
                </div>
            </footer>
        </div>
    );
}

export default Page;
