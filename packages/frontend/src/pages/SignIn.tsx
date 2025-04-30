import {FormEvent, useEffect, useState} from 'react';
import {useNavigate} from "react-router-dom";

const SignIn = () => {
    const navigate = useNavigate()
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string>('');

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        if (!email || !password) {
            setError('Please enter both email and password.');
            return;
        }

        // Simple validation for email format
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            setError('Please enter a valid email address.');
            return;
        }

        // Extract the email name (before @)
        const emailName = email.split('@')[0];

        // Simulate a successful login and store the email name (without @gmail.com) in local storage
        localStorage.setItem('isSignedIn', 'true');
        localStorage.setItem('emailName', emailName);  // Store the email name without @gmail.com
        setError('');
        navigate('/')
    };


    useEffect(() => {
        const isSignedIn = localStorage.getItem('isSignedIn');
        const emailName = localStorage.getItem('emailName');

        if (isSignedIn === 'true' && emailName) {
            navigate('/');
        }
    }, [navigate]);

    return (
        <div className="flex justify-center items-center h-screen bg-green-50">
            <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-3xl font-semibold text-center text-green-600">Sign In</h2>
                <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-gray-700">Email Address</label>
                        <input
                            id="email"
                            type="email"
                            autoComplete='current-password'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                    </div>

                    <div className="mt-4">
                        <label htmlFor="password" className="block text-gray-700">Password</label>
                        <input
                            id="password"
                            type="password"
                            autoComplete='current-password'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                    </div>

                    {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

                    <button
                        type="submit"
                        className="w-full py-2 mt-6 text-white bg-green-500 hover:bg-green-600 rounded-md transition duration-300"
                    >
                        Sign In
                    </button>
                </form>

                <p className="mt-4 text-center text-gray-600">
                    <span>Don't have an account? </span>
                    <a href="/signup" className="text-green-500 hover:underline">Sign Up</a>
                </p>
            </div>
        </div>
    );
};

export default SignIn;
