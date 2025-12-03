import { useEffect, useState } from 'react'
import { Card } from './Card'
import ChartLine from './ChartLine'
import ChartBar from './ChartBar'
import QRPreview from './QRPreview'
import QRDownloadButton from './QRDownloadButton'

import Link from 'next/link'

interface AnalyticsPanelProps {
    linkId: string
    onClose?: () => void
    isPremium?: boolean
}

export default function AnalyticsPanel({ linkId, onClose, isPremium = false }: AnalyticsPanelProps) {
    const [stats, setStats] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    // Customization State
    const [qrColor, setQrColor] = useState('#0A1A2F')
    const [qrBg, setQrBg] = useState('#FFFFF0')
    const [qrStyle, setQrStyle] = useState<'square' | 'dots' | 'rounded'>('square')

    useEffect(() => {
        fetchStats()
    }, [linkId])

    async function fetchStats() {
        setLoading(true)
        try {
            const res = await fetch('/api/analytics/summary', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ linkId }),
            })
            const data = await res.json()
            if (data.ok) {
                setStats(data.stats)
            }
        } catch (error) {
            console.error('Failed to fetch stats', error)
        } finally {
            setLoading(false)
        }
    }

    if (loading) return <div className="p-8 text-center text-slateGray">Loading analytics...</div>
    if (!stats) return <div className="p-8 text-center text-slateGray">No data available</div>

    return (
        <div className="space-y-6 animate-in slide-in-from-right duration-300">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-heading font-bold text-deepNavy">Analytics Overview</h2>
                {onClose && (
                    <button onClick={onClose} className="text-slateGray hover:text-deepNavy">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                )}
            </div>

            {/* Key Metrics - ALWAYS VISIBLE */}
            <Card className="p-6 flex flex-col justify-center items-center text-center mb-6">
                <span className="text-slateGray text-sm uppercase tracking-wider font-semibold">Total Clicks</span>
                <span className="text-4xl font-bold text-deepNavy mt-2">{stats.totalClicks}</span>
            </Card>

            {/* Advanced Stats - BLURRED FOR FREE USERS */}
            <div className="relative">
                <div className={!isPremium ? 'filter blur-sm select-none pointer-events-none' : ''}>

                    {/* QR Design Studio */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-8">
                        <div className="border-b border-slate-100 p-6 flex justify-between items-center bg-slate-50/50">
                            <div>
                                <h3 className="font-heading font-bold text-lg text-deepNavy flex items-center gap-2">
                                    <span className="text-xl">🎨</span> Design Studio
                                </h3>
                                <p className="text-slate-500 text-sm mt-1">Customize your QR code appearance</p>
                            </div>
                            {isPremium && <span className="text-xs font-bold px-3 py-1 bg-gold-100 text-gold-700 rounded-full uppercase tracking-wide">Premium Unlocked</span>}
                        </div>

                        <div className="p-0 grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-100">
                            {/* Left: Preview Canvas */}
                            <div className="lg:col-span-5 p-8 bg-slate-50/80 flex flex-col items-center justify-center relative">
                                <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
                                    style={{ backgroundImage: 'radial-gradient(#475569 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
                                </div>

                                <div className="relative z-10 bg-white p-4 rounded-xl shadow-lg border border-slate-100 transition-all duration-300 hover:shadow-xl hover:scale-[1.02]">
                                    <QRPreview
                                        code={stats.code || 'unknown'}
                                        size={240}
                                        color={qrColor}
                                        bg={qrBg}
                                        style={qrStyle}
                                    />
                                </div>

                                <div className="mt-8 w-full max-w-[240px]">
                                    <QRDownloadButton
                                        code={stats.code || 'unknown'}
                                        size={1024}
                                        color={qrColor}
                                        bg={qrBg}
                                        style={qrStyle}
                                        className="w-full"
                                    >
                                        <span className="flex items-center justify-center gap-2 w-full">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                                            Download High-Res SVG
                                        </span>
                                    </QRDownloadButton>
                                </div>
                            </div>

                            {/* Right: Controls */}
                            <div className="lg:col-span-7 p-8 space-y-8 bg-white relative">
                                {!isPremium && (
                                    <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-20 flex items-center justify-center">
                                        <div className="bg-white p-6 rounded-xl shadow-xl border border-slate-100 text-center max-w-xs mx-4">
                                            <div className="w-12 h-12 bg-gold-100 text-gold-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">🔒</div>
                                            <h4 className="font-bold text-deepNavy mb-2">Pro Feature</h4>
                                            <p className="text-slate-500 text-sm mb-4">Upgrade to customize shapes and colors.</p>
                                            <Link href="/pricing" className="text-gold-600 font-bold text-sm hover:underline">View Plans &rarr;</Link>
                                        </div>
                                    </div>
                                )}

                                {/* Shape Selector */}
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">QR Shape</label>
                                    <div className="grid grid-cols-3 gap-4">
                                        {[
                                            { id: 'square', label: 'Classic', icon: <div className="w-8 h-8 bg-current rounded-sm" /> },
                                            { id: 'dots', label: 'Modern', icon: <div className="w-8 h-8 bg-current rounded-full" /> },
                                            { id: 'rounded', label: 'Soft', icon: <div className="w-8 h-8 bg-current rounded-lg" /> }
                                        ].map((item) => (
                                            <button
                                                key={item.id}
                                                onClick={() => setQrStyle(item.id as any)}
                                                className={`group relative p-4 rounded-xl border-2 transition-all duration-200 flex flex-col items-center gap-3 ${qrStyle === item.id
                                                        ? 'border-deepNavy bg-navy-50 text-deepNavy shadow-sm'
                                                        : 'border-slate-100 hover:border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-50'
                                                    }`}
                                            >
                                                {item.icon}
                                                <span className="text-xs font-medium">{item.label}</span>
                                                {qrStyle === item.id && (
                                                    <div className="absolute top-2 right-2 w-2 h-2 bg-deepNavy rounded-full" />
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="h-px bg-slate-100" />

                                {/* Color Pickers */}
                                <div className="grid grid-cols-2 gap-8">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Foreground</label>
                                        <div className="flex items-center gap-3">
                                            <div className="relative group">
                                                <input
                                                    type="color"
                                                    value={qrColor}
                                                    onChange={(e) => setQrColor(e.target.value)}
                                                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                                                />
                                                <div className="w-12 h-12 rounded-xl border border-slate-200 shadow-sm flex items-center justify-center transition-transform group-hover:scale-105" style={{ backgroundColor: qrColor }}>
                                                    <div className="w-full h-full rounded-xl ring-1 ring-inset ring-black/5" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Background</label>
                                        <div className="flex items-center gap-3">
                                            <div className="relative group">
                                                <input
                                                    type="color"
                                                    value={qrBg}
                                                    onChange={(e) => setQrBg(e.target.value)}
                                                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                                                />
                                                <div className="w-12 h-12 rounded-xl border border-slate-200 shadow-sm flex items-center justify-center transition-transform group-hover:scale-105" style={{ backgroundColor: qrBg }}>
                                                    <div className="w-full h-full rounded-xl ring-1 ring-inset ring-black/5" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Charts */}
                    <Card className="p-6 mb-6">
                        <h3 className="text-lg font-heading font-semibold mb-4 text-deepNavy">Clicks Over Time (30 Days)</h3>
                        <ChartLine data={stats.timeseries} height={300} />
                    </Card>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card className="p-6">
                            <h3 className="text-lg font-heading font-semibold mb-4 text-deepNavy">Top Locations</h3>
                            <ChartBar data={stats.topCountries.slice(0, 5)} height={250} color="#0A1A2F" />
                        </Card>
                        <Card className="p-6">
                            <h3 className="text-lg font-heading font-semibold mb-4 text-deepNavy">Top Devices</h3>
                            <ChartBar data={stats.topDevices.slice(0, 5)} height={250} color="#D4AF37" />
                        </Card>
                    </div>
                </div>

                {/* Upgrade Overlay */}
                {!isPremium && (
                    <div className="absolute inset-0 flex items-center justify-center z-10">
                        <div className="bg-white/90 backdrop-blur-sm p-8 rounded-xl shadow-xl text-center max-w-md border border-gold/20">
                            <div className="text-4xl mb-4">🔒</div>
                            <h3 className="text-2xl font-heading font-bold text-deepNavy mb-2">Unlock Advanced Analytics</h3>
                            <p className="text-slateGray mb-6">
                                Upgrade to Premium to see detailed charts, location breakdowns, and device analytics.
                            </p>
                            <Link href="/pricing" className="bg-gold text-white font-bold py-3 px-8 rounded-full hover:bg-gold-600 transition-colors shadow-lg inline-block">
                                Upgrade Now
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
