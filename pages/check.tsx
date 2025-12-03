import { useState } from 'react'
import Layout from '../components/Layout'
import { Card } from '../components/Card'
import Link from 'next/link'

export default function CheckLink() {
    const [url, setUrl] = useState('')
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error' | 'not_found'>('idle')
    const [linkData, setLinkData] = useState<any>(null)

    async function handleCheck(e: React.FormEvent) {
        e.preventDefault()
        setStatus('loading')
        setLinkData(null)

        try {
            const res = await fetch('/api/check-link', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url }),
            })

            const data = await res.json()

            if (res.ok) {
                setLinkData(data.link)
                setStatus('success')
            } else if (res.status === 404) {
                setStatus('not_found')
            } else {
                setStatus('error')
            }
        } catch (error) {
            setStatus('error')
        }
    }

    return (
        <Layout title="Link Safety Checker - VAYRO">
            <div className="bg-deepNavy text-ivory py-20">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl font-heading font-bold mb-4">Link Safety Checker</h1>
                    <p className="text-xl text-slate-300 max-w-2xl mx-auto">
                        Verify any Vayro link before you click. Ensure your safety with our real-time checker.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12 max-w-2xl -mt-10">
                <Card className="p-8 shadow-xl">
                    <form onSubmit={handleCheck} className="mb-8">
                        <label className="block text-sm font-bold text-deepNavy mb-2">Paste Vayro Link</label>
                        <div className="flex gap-4">
                            <input
                                type="text"
                                required
                                placeholder="vayro.io/..."
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500 transition-all"
                            />
                            <button
                                type="submit"
                                disabled={status === 'loading'}
                                className="bg-deepNavy text-white font-bold px-8 py-3 rounded-xl hover:bg-opacity-90 transition-all disabled:opacity-70"
                            >
                                {status === 'loading' ? 'Checking...' : 'Check Safety'}
                            </button>
                        </div>
                    </form>

                    {status === 'not_found' && (
                        <div className="bg-slate-100 text-slate-600 p-6 rounded-xl text-center">
                            <div className="text-4xl mb-2">❓</div>
                            <h3 className="font-bold text-lg">Link Not Found</h3>
                            <p>This link does not exist in our system.</p>
                        </div>
                    )}

                    {status === 'error' && (
                        <div className="bg-red-50 text-red-600 p-6 rounded-xl text-center">
                            <p>Something went wrong. Please try again.</p>
                        </div>
                    )}

                    {status === 'success' && linkData && (
                        <div className={`p-6 rounded-xl border-2 ${linkData.status === 'BANNED' ? 'bg-red-50 border-red-100' :
                                linkData.reports > 0 ? 'bg-yellow-50 border-yellow-100' :
                                    'bg-green-50 border-green-100'
                            }`}>
                            <div className="text-center mb-6">
                                <div className="text-5xl mb-4">
                                    {linkData.status === 'BANNED' ? '🚫' :
                                        linkData.reports > 0 ? '⚠️' : '✅'}
                                </div>
                                <h2 className={`text-2xl font-bold ${linkData.status === 'BANNED' ? 'text-red-700' :
                                        linkData.reports > 0 ? 'text-yellow-700' :
                                            'text-green-700'
                                    }`}>
                                    {linkData.status === 'BANNED' ? 'Dangerous Link (Banned)' :
                                        linkData.reports > 0 ? 'Caution Advised' :
                                            'Safe to Visit'}
                                </h2>
                                <p className="text-slate-600 mt-2">
                                    {linkData.status === 'BANNED' ? 'This link has been banned due to abuse reports.' :
                                        linkData.reports > 0 ? 'This link has been flagged by the community.' :
                                            'This link has no reports and appears safe.'}
                                </p>
                            </div>

                            <div className="space-y-4 bg-white/50 p-4 rounded-lg">
                                <div className="flex justify-between border-b border-slate-200/50 pb-2">
                                    <span className="text-slate-500">Destination:</span>
                                    <span className="font-mono text-deepNavy break-all text-right pl-4">{linkData.target}</span>
                                </div>
                                <div className="flex justify-between border-b border-slate-200/50 pb-2">
                                    <span className="text-slate-500">Created:</span>
                                    <span className="font-medium text-deepNavy">{new Date(linkData.createdAt).toLocaleDateString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-500">Community Reports:</span>
                                    <span className={`font-bold ${linkData.reports > 0 ? 'text-red-500' : 'text-green-500'}`}>
                                        {linkData.reports}
                                    </span>
                                </div>
                            </div>

                            <div className="mt-6 text-center">
                                <Link href="/report" className="text-sm text-slate-500 hover:text-red-500 underline">
                                    Report this link as abusive
                                </Link>
                            </div>
                        </div>
                    )}
                </Card>
            </div>
        </Layout>
    )
}
