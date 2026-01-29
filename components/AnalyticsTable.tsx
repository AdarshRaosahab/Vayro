import React from 'react';

const AnalyticsTable = () => {
    // Mock Data for now, real usage would fetch from API
    const links = [
        { short: 'vay.ro/Xy9z2A', original: 'https://twitter.com/search?q=typescript', clicks: 245, date: 'Jan 28, 2026' },
        { short: 'vay.ro/bK3m9L', original: 'https://github.com/vercel/next.js', clicks: 128, date: 'Jan 27, 2026' },
        { short: 'vay.ro/p8N2xQ', original: 'https://dribbble.com/shots/142512-dashboard-ui', clicks: 89, date: 'Jan 26, 2026' },
    ];

    return (
        <div className="w-full overflow-x-auto bg-navy-800 rounded-xl shadow-xl border border-navy-700">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-navy-900 border-b border-navy-700 text-ivory-200 text-sm uppercase tracking-wider">
                        <th className="p-4 font-heading font-semibold">Short Link</th>
                        <th className="p-4 font-heading font-semibold">Original URL</th>
                        <th className="p-4 font-heading font-semibold">Total Clicks</th>
                        <th className="p-4 font-heading font-semibold">Created At</th>
                    </tr>
                </thead>
                <tbody className="text-ivory-100 divide-y divide-navy-700">
                    {links.map((link, i) => (
                        <tr key={i} className="hover:bg-navy-700/50 transition-colors">
                            <td className="p-4 font-mono text-gold-400 font-medium">{link.short}</td>
                            <td className="p-4 max-w-xs truncate text-navy-300" title={link.original}>{link.original}</td>
                            <td className="p-4 font-bold">{link.clicks.toLocaleString()}</td>
                            <td className="p-4 text-sm text-navy-300">{link.date}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AnalyticsTable;
