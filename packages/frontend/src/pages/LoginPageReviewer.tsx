import { useEffect, useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

const loadingSteps = [
    'Analyzing HTML structure',
    'Checking Accessibility compliance',
    'Scanning Console Logs',
    'Verifying Security (localStorage, Cookies)',
    'Finalizing Audit Report',
];

export default function LoginPageReviewer() {
    const [url, setUrl] = useState('');
    // const [userEmail, setUserEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [loadingStep, setLoadingStep] = useState(0);
    const [typingDots, setTypingDots] = useState('');
    // const [sending, setSending] = useState(false);
    const [auditData, setAuditData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        let stepInterval;
        let typingInterval;

        if (loading) {
            setLoadingStep(0);
            setTypingDots('');

            typingInterval = setInterval(() => {
                setTypingDots((prev) => (prev.length >= 3 ? '' : prev + '.'));
            }, 400);

            stepInterval = setInterval(() => {
                setLoadingStep((prev) => (prev < loadingSteps.length - 1 ? prev + 1 : prev));
            }, 2500 + Math.random() * 1000);
        } else {
            clearInterval(stepInterval);
            clearInterval(typingInterval);
        }

        return () => {
            clearInterval(stepInterval);
            clearInterval(typingInterval);
        };
    }, [loading]);

    const handleAudit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setAuditData(null);

        try {
            const { data } = await axios.post('http://localhost:3020/api/v2/review', { siteUrl: url });
            setAuditData(data);
        } catch (err) {
            if (axios.isAxiosError(err)) {
                setError(err.response?.data?.error || 'Audit failed. Check the URL and try again.');
            } else {
                setError('Unexpected error occurred.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        // <div className="h-[100%] flex flex-1 flex-row justify-center items-center py-4 pl-[4px]">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="max-w-2xl h-[100%] mx-auto bg-white border border-gray-200 rounded-2xl px-4 py-3 flex-1"
            >
                <h1 className="text-xl font-semibold text-black mb-2">AI Website Diagnostics</h1>
                <p className="text-sm text-gray-500 mb-2 mx-3 border-b-1 pb-3 border-gray-200">
                    Inspect your website for issues in UX, accessibility, critical security vulnerabilities, performance, and more.
                </p>

                {!auditData && (
                    <form onSubmit={handleAudit} className="space-y-4">
                        <input
                            type="url"
                            placeholder="Enter your login page URL"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            required
                            className="w-[85%] px-4 py-2.5 rounded-xl border border-gray-300 text-sm bg-white focus:outline-none"
                        />
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-[85%] mt-2 cursor-pointer bg-black text-white text-sm font-medium py-2.5 rounded-xl hover:opacity-90 disabled:opacity-50 transition"
                        >
                            {loading ? 'Auditing...' : 'Run Audit'}
                        </button>
                    </form>
                )}

                {loading && (
                    <div className="mt-6 text-center text-black text-sm font-medium">
                        {loadingSteps[loadingStep]}
                        <span className="animate-pulse ml-1">{typingDots}</span>
                    </div>
                )}

                {error && <div className="text-red-600 font-medium text-sm text-center mt-4">{error}</div>}

                <AnimatePresence>
                    {auditData && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            transition={{ duration: 0.4 }}
                        >
                            <div className="w-full max-w-3xl max-h-[550px] overflow-auto  hide-scrollbar mx-auto rounded-2xl bg-white mt-4 text-black pb-1">
                                <h2 className="text-base font-semibold text-center mb-3">Diagnostic Overview</h2>

                                <div className="bg-gray-100 p-3 rounded-xl text-center border border-gray-200 mb-4">
                                    <h3 className="text-xs font-medium text-gray-600 mb-1">Site Health Score</h3>
                                    <div className="text-2xl font-bold text-black">{auditData.overallScore}/100</div>
                                </div>
                                <div className="space-y-3">
                                    {auditData.sections.Security.concat(
                                        auditData.sections.UX,
                                        auditData.sections.Accessibility,
                                        auditData.sections.Console
                                    ).slice(0, 5).map((issue, index) => (
                                        <div key={index} className="bg-white border border-gray-200 p-4 rounded-xl flex flex-col gap-1">
                                            <h4 className="text-sm pl-[30px] text-left font-semibold text-black">{index + 1}. {issue.title}</h4>
                                            <p className="text-sm pl-[45px] text-left text-gray-700"><span className="font-medium">Issue:</span> {issue.issue}</p>
                                            <p className="text-sm pl-[45px] text-left text-gray-700"><span className="font-medium">Fix:</span> {issue.fix}</p>
                                            <p className="text-sm pl-[45px] text-left text-gray-700"><span className="font-medium">Severity:</span> <span className={issue.severity==='Major'?'text-red-600':'text-yellow-500'}>{issue.severity}</span></p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <button
                                onClick={() => setAuditData(null)}
                                className="text-sm text-black underline hover:opacity-70 cursor-pointer transition mt-2 mb-4"
                            >
                                Run another audit
                            </button>
                        </motion.div>
                        )}
                </AnimatePresence>
            </motion.div>
        // </div>
    );
}
