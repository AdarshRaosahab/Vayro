import React, { useState } from 'react';

const QuickShorten = () => {
    const [url, setUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [shortLink, setShortLink] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setShortLink('');

        try {
            // Use local Next.js API (Robus with Mock Fallback)
            const response = await fetch('/api/shorten', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ url }),
            });

            if (!response.ok) {
                const contentType = response.headers.get("content-type");
                let errorMessage = `Error ${response.status}: Failed to shorten`;

                if (contentType && contentType.includes("application/json")) {
                    const errData = await response.json();
                    if (Array.isArray(errData.detail)) {
                        errorMessage = errData.detail.map((e: any) => e.msg).join(', ');
                    } else if (typeof errData.detail === 'string') {
                        errorMessage = errData.detail;
                    }
                } else {
                    const text = await response.text();
                    console.error("Non-JSON Error:", text);
                }
                throw new Error(errorMessage);
            }

            const data = await response.json();
            // Store full URL for copying, but display cleaner version
            setShortLink(data.short_url);
        } catch (err: any) {
            console.error(err);
            setError(err.message || 'Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Helper to format for display: replace domain with vayro.in
    const formatDisplayUrl = (url: string) => {
        // If it comes back as specific short path (e.g. /abc), prepend domain
        if (url.startsWith('/')) {
            return `vayro.in${url}`;
        }

        const clean = url.replace(/^https?:\/\/(www\.)?/, '');
        return clean.replace(/^[^\/]+/, 'vayro.in');
    };

    return (
        <div className="w-full max-w-2xl mx-auto p-6 bg-navy-800 rounded-xl shadow-2xl border border-navy-700 relative">

            {/* Error Toast */}
            {error && (
                <div className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded shadow-lg text-sm font-bold animate-pulse">
                    {error}
                </div>
            )}

            <h2 className="text-2xl font-heading font-bold text-ivory-50 mb-4 text-center">
                Shorten Your Link Instantly
            </h2>
            <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4">
                <input
                    type="url"
                    placeholder="Paste your long URL here..."
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    required
                    className="flex-1 px-4 py-3 rounded-lg bg-navy-900 border border-navy-500 text-ivory-50 placeholder-navy-300 focus:outline-none focus:ring-2 focus:ring-gold-500 transition-all font-sans"
                />
                <button
                    type="submit"
                    disabled={loading}
                    className="px-8 py-3 bg-gold-500 hover:bg-gold-400 text-navy-900 font-bold rounded-lg shadow-lg hover:shadow-gold-500/20 transform hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[140px]"
                >
                    {loading ? (
                        <svg className="animate-spin h-5 w-5 text-navy-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    ) : (
                        'Shorten'
                    )}
                </button>
            </form>

            {shortLink && (
                <div className="mt-6 p-4 bg-navy-900 rounded-lg border border-gold-500/30 flex items-center justify-between animate-fade-in">
                    <span className="text-gold-400 font-mono text-lg truncate pr-4">
                        {formatDisplayUrl(shortLink)}
                    </span>
                    <button
                        onClick={() => {
                            const textToCopy = formatDisplayUrl(shortLink);
                            navigator.clipboard.writeText(textToCopy);
                        }}
                        className="text-ivory-200 hover:text-white text-sm font-medium underline decoration-gold-500/50 hover:decoration-gold-500 transition-all whitespace-nowrap"
                    >
                        Copy Link
                    </button>
                </div>
            )}
        </div>
    );
};

export default QuickShorten;
