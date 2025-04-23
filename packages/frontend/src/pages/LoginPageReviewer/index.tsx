import { useState } from 'react';
import axios from 'axios';
import './index.css';

const LoginPageReviewer = () => {
    const [url, setUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const { data } = await axios.post('http://localhost:3000/api/v1/review', { siteUrl: url });

            // Wrap into an object keyed by page for compatibility with your loop
            setResult(data)
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

    console.log(result)

    return (
        <div className="login-page-reviewer-container">
            <h1>🔍 Login Page Reviewer</h1>
            <form onSubmit={handleSubmit}>
                <input
                    placeholder="Login Page URL"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    required
                />
                <button type="submit" disabled={loading}>
                    {loading ? 'Auditing...' : 'Run Audit'}
                </button>
            </form>

            {loading && (
                <div className="ai-loader">
                    <span className="dot">💭</span>
                    <span className="dot">💭</span>
                    <span className="dot">💭</span>
                </div>
            )}

            {error && <div className="error">{error}</div>}

            {result && (
                <div className="results">
                    <h2>📋 Audit Report</h2>
                    {result.split(/\n(?=\d+\.\s\*\*)/).map((block, index) => {
                        const lines = block.trim().split('\n').filter(Boolean);

                        const titleMatch = lines[0]?.match(/\d+\.\s\*\*(.*?)\*\*/);
                        const issueMatch = lines.find(line => line.includes('**Issue:**'))?.match(/\*\*Issue:\*\*\s*(.*)/);
                        const fixMatch = lines.find(line => line.includes('**Fix:**'))?.match(/\*\*Fix:\*\*\s*(.*)/);

                        const title = titleMatch ? titleMatch[1] : '';
                        const issue = issueMatch ? issueMatch[1] : '';
                        const fix = fixMatch ? fixMatch[1] : '';

                        return (
                            <div key={index} className="audit-block">
                                <p className="title"><strong>{index + 1}. {title}</strong></p>
                                <p className="issue"><strong>🛑 Issue:</strong> {issue}</p>
                                <p className="fix"><strong>🛠 Fix:</strong> {fix}</p>
                            </div>
                        );
                    })}
                </div>
            )}

        </div>
    );
};

export default LoginPageReviewer;

