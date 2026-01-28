import React from 'react';

interface LinkData {
    id: string;
    original: string;
    short: string;
    clicks: number;
    createdAt: string;
}

const mockData: LinkData[] = [
    { id: '1', original: 'https://very-long-url.com/path', short: 'vay.ro/a1b2', clicks: 1243, createdAt: '2023-10-25' },
    { id: '2', original: 'https://google.com', short: 'vay.ro/goog', clicks: 89, createdAt: '2023-10-26' },
    { id: '3', original: 'https://marketing-campaign.com/winter-sale', short: 'vay.ro/sale', clicks: 5432, createdAt: '2023-10-27' },
];

const AnalyticsTable = () => {
    return (
        <div className="overflow-x-auto rounded-xl border border-navy-700 shadow-xl bg-navy-800">
            <table className="w-full text-left text-sm text-ivory-100">
                <thead className="bg-navy-900 text-gold-500 uppercase font-heading font-bold text-xs tracking-wider border-b border-navy-700">
                    <tr>
                        <th scope="col" className="px-6 py-4">Short Link</th>
                        <th scope="col" className="px-6 py-4">Original URL</th>
                        <th scope="col" className="px-6 py-4 text-center">Clicks</th>
                        <th scope="col" className="px-6 py-4 text-right">Created</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-navy-700">
                    {mockData.map((link) => (
                        <tr key={link.id} className="hover:bg-navy-700/50 transition-colors duration-150">
                            <td className="px-6 py-4 font-medium text-gold-400 font-mono">
                                {link.short}
                            </td>
                            <td className="px-6 py-4 text-ivory-300 max-w-xs truncate" title={link.original}>
                                {link.original}
                            </td>
                            <td className="px-6 py-4 text-center font-bold text-white">
                                {link.clicks.toLocaleString()}
                            </td>
                            <td className="px-6 py-4 text-right text-ivory-300">
                                {link.createdAt}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AnalyticsTable;
