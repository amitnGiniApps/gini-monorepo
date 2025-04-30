import { ReactNode, useEffect, useState } from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import { Menu, MenuItem, IconButton } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';

function Page({ children, className }: { children: ReactNode, className?: string }) {
    const navigate = useNavigate();
    const location = useLocation()
    const isSignedIn = localStorage.getItem('isSignedIn') === 'true';
    const emailName = localStorage.getItem('emailName');

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    useEffect(() => {
        if ((!isSignedIn || !emailName) && location.pathname != '/') {
            navigate('/signin');
        }
    }, [isSignedIn, emailName, navigate]);

    const handleLogout = () => {
        localStorage.removeItem('isSignedIn');
        localStorage.removeItem('emailName');
        navigate('/signin');
    };

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <header className="bg-white shadow-md flex items-center justify-between px-6 py-4">
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

                    {isSignedIn && emailName ? (
                        <div className="flex items-center gap-2">
                            <span className="text-gray-700 font-medium">{emailName}</span>
                            <IconButton onClick={handleMenuOpen} size="small">
                                <PersonIcon sx={{fontSize: 32, color: '#4B5563'}}/> {/* Tailwind's gray-600 */}
                            </IconButton>
                            <Menu
                                anchorEl={anchorEl}
                                open={open}
                                onClose={handleMenuClose}
                                onClick={handleMenuClose}
                                transformOrigin={{horizontal: 'right', vertical: 'top'}}
                                anchorOrigin={{horizontal: 'right', vertical: 'bottom'}}
                            >
                                <MenuItem onClick={handleLogout}>Logout</MenuItem>
                            </Menu>
                        </div>
                    ) : <button className="bg-green-600 text-white px-4 py-1 rounded-lg text-sm">Sign Up</button>}
                </nav>
            </header>

            <main className={`flex flex-1 flex-row justify-between items-center py-4 pl-[4px] pr-5 ${className}`}>
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
