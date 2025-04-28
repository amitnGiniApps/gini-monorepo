import { useEffect, useState } from 'react';
import axios from 'axios';
import './index.css';

const loadingSteps = [
    "Analyzing HTML structure",
    "Checking Accessibility compliance",
    "Scanning Console Logs",
    "Verifying Security (localStorage, Cookies)",
    "Finalizing Audit Report"
];

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

            // Typing dots animation
            typingInterval = setInterval(() => {
                setTypingDots((prev) => prev.length >= 3 ? '' : prev + '.');
            }, 400);

            // Step switching slower and more random
            stepInterval = setInterval(() => {
                setLoadingStep((prev) => {
                    if (prev < loadingSteps.length - 1) return prev + 1;
                    return prev;
                });
            }, Math.floor(2500 + Math.random() * 1000)); // between 2.5s-3.5s
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
            const { data } = await axios.post('http://localhost:3000/api/v1/review', { siteUrl: url });
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
            await axios.post('http://localhost:3000/api/v1/send-report', {
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
        <div className="login-page-reviewer-container">
            <h1>🔍 Login Page Reviewer</h1>

            {/* Form */}
            <form onSubmit={handleAudit}>
                <input
                    placeholder="Enter your login page URL"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    required
                />
                <button type="submit" disabled={loading}>
                    {loading ? 'Auditing...' : 'Run Audit'}
                </button>
            </form>

            {/* Smart AI Loading */}
            {loading && (
                <div className="ai-smart-loader">
                    <div className="ai-step">{loadingSteps[loadingStep]}<span className="typing">{typingDots}</span></div>
                </div>
            )}

            {/* Error Message */}
            {error && <div className="error">{error}</div>}

            {/* Audit Results */}
            {auditData && (
                <>
                    <div className="results">
                        <h2>📋 Audit Summary</h2>

                        {/* Score Box */}
                        <div className="score-box">
                            <h3>Site Health Score</h3>
                            <div className="score-number">{auditData.overallScore}/100</div>
                        </div>

                        {/* Section Scores */}
                        <h3>Section Scores</h3>
                        {Object.entries(auditData.sectionScores).map(([section, score]: any, index) => (
                            <div key={index} className="section-score">
                                <strong>{section}:</strong> {score}/100
                            </div>
                        ))}

                        {/* Top Critical Issues */}
                        <h3>Critical Issues</h3>
                        {auditData.sections.Security.concat(
                            auditData.sections.UX,
                            auditData.sections.Accessibility,
                            auditData.sections.Console
                        )
                            .slice(0, 5)
                            .map((issue: any, index: number) => (
                                <div key={index} className="audit-block">
                                    <p className="title"><strong>{index + 1}. {issue.title}</strong></p>
                                    <p className="issue"><strong>🛑 Issue:</strong> {issue.issue}</p>
                                    <p className="fix"><strong>🛠 Fix:</strong> {issue.fix}</p>
                                    <p className="severity"><strong>🚨 Severity:</strong> {issue.severity}</p>
                                </div>
                            ))}
                    </div>

                    {/* Email input and Send button */}
                    <div className="email-send-section">
                        <input
                            type="email"
                            placeholder="Enter your email to receive report"
                            value={userEmail}
                            onChange={(e) => setUserEmail(e.target.value)}
                            required
                        />
                        <button onClick={handleSendReport} disabled={sending} className="pdf-button">
                            {sending ? 'Sending PDF...' : '📄 Send Audit Report'}
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default LoginPageReviewer;
