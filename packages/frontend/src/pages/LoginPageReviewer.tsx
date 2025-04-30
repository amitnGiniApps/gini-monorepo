import { useEffect, useState } from 'react';
import axios from 'axios';
import Page from "./Page.tsx";

const LoginPageReviewer = () => {
    const [url, setUrl] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [loadingStep, setLoadingStep] = useState(0);
    const [typingDots, setTypingDots] = useState('');
    const [sending, setSending] = useState(false);
    const [auditData, setAuditData] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let stepInterval: any;
        let typingInterval: any;

        if (loading) {
            setLoadingStep(0);
            setTypingDots('');

            typingInterval = setInterval(() => {
                setTypingDots((prev) => (prev.length >= 3 ? '' : prev + '.'));
            }, 400);

            stepInterval = setInterval(() => {
                setLoadingStep((prev) => (prev < loadingSteps.length - 1 ? prev + 1 : prev));
            }, Math.floor(2500 + Math.random() * 1000));
        } else {
            clearInterval(stepInterval);
            clearInterval(typingInterval);
        }

        return () => {
            clearInterval(stepInterval);
            clearInterval(typingInterval);
        };
    }, [loading]);

    const handleAudit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setAuditData(null);

        try {
            const { data } = await axios.post('http://localhost:3020/api/v2/review', { siteUrl: url });
            setAuditData(data);
        } catch (err: any) {
            if (axios.isAxiosError(err)) {
                setError(err.response?.data?.error || 'Audit failed. Check the URL and try again.');
            } else {
                setError('Unexpected error occurred.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleSendReport = async () => {
        if (!auditData?.pdfPath) {
            alert('No report available to send.');
            return;
        }

        if (!userEmail) {
            alert('Please enter your email first.');
            return;
        }

        setSending(true);
        try {
            await axios.post('http://localhost:3020/api/v2/send-report', {
                toEmail: userEmail,
                pdfPath: auditData.pdfPath,
            });
            alert('✅ Report sent successfully!');
        } catch (err) {
            alert('❌ Failed to send report.');
        } finally {
            setSending(false);
        }
    };

    return (
        <Page className='mt-5 flex !flex-col'>
            <div className="max-w-4xl mx-auto p-8 bg-gray-100 rounded-lg text-gray-800">
                <h1 className="text-3xl font-bold mb-2">🔍 Login Page Reviewer</h1>
                <p className="mb-6 text-gray-600">Run a quick audit on your login page to check for UX, accessibility, console, and security issues.</p>

                {/* Form */}
                <form onSubmit={handleAudit} className="space-y-4">
                    <input
                        type="url"
                        placeholder="Enter your login page URL"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        required
                        className="w-full p-3 border border-gray-300 rounded-md"
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-green-600 text-white font-semibold py-3 rounded-md hover:bg-green-700 disabled:bg-green-300 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Auditing...' : 'Run Audit'}
                    </button>
                </form>
            </div>


            {/* Smart AI Loading */}
                {loading && (
                    <div className="mt-6 text-center">
                        <div className="text-xl font-semibold text-green-600">
                            {loadingSteps[loadingStep]}
                            <span className="animate-pulse ml-1">{typingDots}</span>
                        </div>
                    </div>
                )}

                {/* Error Message */}
                {error && <div className="text-red-600 font-bold text-center mt-4">{error}</div>}

                {/* Audit Results */}
            {auditData && (
                <>
                    <div className="mt-8 p-6 bg-white rounded-lg text-gray-800 shadow-lg text-start">
                        <h2 className="text-2xl text-blue-700 font-semibold mb-4 text-center">📋 Audit Summary</h2>

                        <div className="bg-blue-50 p-4 rounded-lg text-center mb-6 border border-blue-200">
                            <h3 className="text-lg text-blue-600 mb-2">Site Health Score</h3>
                            <div className="text-4xl font-bold text-green-600">{auditData.overallScore}/100</div>
                        </div>

                        <h3 className="text-lg text-blue-600 mb-4">Section Scores</h3>
                        {Object.entries(auditData.sectionScores).map(([section, score]: any, index) => (
                            <div key={index} className="mb-2">
                                <strong>{section}:</strong> {score}/100
                            </div>
                        ))}

                        <h3 className="text-lg text-blue-600 mt-6 mb-4">Critical Issues</h3>
                        {auditData.sections.Security.concat(
                            auditData.sections.UX,
                            auditData.sections.Accessibility,
                            auditData.sections.Console
                        )
                            .slice(0, 5)
                            .map((issue: any, index: number) => (
                                <div key={index} className="bg-red-50 border-l-4 border-red-400 p-4 mb-4 rounded-md">
                                    <p className="font-bold text-red-800 mb-1">{index + 1}. {issue.title}</p>
                                    <p className="text-red-700"><strong>🛑 Issue:</strong> {issue.issue}</p>
                                    <p className="text-green-700"><strong>🛠 Fix:</strong> {issue.fix}</p>
                                    <p className="text-yellow-700"><strong>🚨 Severity:</strong> {issue.severity}</p>
                                </div>
                            ))}
                    </div>

                    <div className="mt-6 flex flex-col items-center space-y-4">
                        <input
                            type="email"
                            placeholder="Enter your email to receive report"
                            value={userEmail}
                            onChange={(e) => setUserEmail(e.target.value)}
                            required
                            className="w-full max-w-md p-3 border border-gray-300 rounded-md"
                        />
                        <button
                            onClick={handleSendReport}
                            disabled={sending}
                            className="bg-red-600 text-white text-lg font-semibold py-3 px-6 rounded-lg hover:bg-red-700 disabled:bg-red-300 disabled:cursor-not-allowed"                        >
                            {sending ? 'Sending PDF...' : '📄 Send Audit Report'}
                        </button>
                    </div>
                </>
            )}
        </Page>
    );
};

const loadingSteps = [
    "Analyzing HTML structure",
    "Checking Accessibility compliance",
    "Scanning Console Logs",
    "Verifying Security (localStorage, Cookies)",
    "Finalizing Audit Report"
];

export default LoginPageReviewer;
