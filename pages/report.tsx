import { useState } from 'react'
import Layout from '../components/Layout'
import { Card } from '../components/Card'

export default function ReportAbuse() {
    const [url, setUrl] = useState('')
    const [reason, setReason] = useState('')
    const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setStatus('submitting')

        try {
            const res = await fetch('/api/report', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url, reason }),
            })

            if (res.ok) {
                setStatus('success')
                setUrl('')
                setReason('')
            } else {
                setStatus('error')
            }
        } catch (error) {
            setStatus('error')
        }
    }

    return (
        <Layout title="Report Abuse - VAYRO">
            <div className="container mx-auto px-4 py-12 max-w-2xl">
                <Card className="p-8 border-red-100 shadow-red-50">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
                            🛡️
                        </div>
                        <h1 className="text-3xl font-heading font-bold text-deepNavy">Report Abuse</h1>
                        <p className="text-slate-500 mt-2">Help us keep VAYRO safe. Report suspicious or malicious links.</p>
                    </div>

                    {status === 'success' ? (
                        <div className="bg-green-50 text-green-700 p-6 rounded-xl text-center">
                            <h3 className="font-bold text-lg mb-2">Thank You</h3>
                            <p>Your report has been submitted. We will investigate and take action.</p>
                            <button
                                onClick={() => setStatus('idle')}
                                className="mt-4 text-sm font-bold underline hover:text-green-800"
                            >
                                Submit another report
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-bold text-deepNavy mb-2">Suspicious Vayro Link</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="https://vayro.io/..."
                                    value={url}
                                    onChange={(e) => setUrl(e.target.value)}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-deepNavy mb-2">Reason for Reporting</label>
                                <select
                                    required
                                    value={reason}
                                    onChange={(e) => setReason(e.target.value)}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
                                >
                                    <option value="">Select a reason...</option>
                                    <option value="phishing">Phishing / Fake Login</option>
                                    <option value="malware">Malware / Spyware / Virus</option>
                                    <option value="ransomware">Ransomware</option>
                                    <option value="fake_kyc">Fake KYC / Verification</option>
                                    <option value="ecommerce_scam">E-commerce Scam</option>
                                    <option value="lottery_scam">Lottery / Prize Scam</option>
                                    <option value="investment_scam">Investment / Crypto Scam</option>
                                    <option value="impersonation">Social Media Impersonation</option>
                                    <option value="clickjacking">Clickjacking / Hidden Redirect</option>
                                    <option value="scareware">Scareware / Fake Antivirus</option>
                                    <option value="survey_scam">Credential Harvesting / Fake Survey</option>
                                    <option value="short_url_hiding">Shortened URL Hiding</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>

                            <button
                                type="submit"
                                disabled={status === 'submitting'}
                                className="w-full bg-red-600 text-white font-bold py-4 rounded-xl hover:bg-red-700 transition-colors shadow-lg shadow-red-200 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {status === 'submitting' ? 'Submitting...' : 'Submit Report'}
                            </button>

                            {status === 'error' && (
                                <p className="text-red-500 text-center text-sm">Failed to submit report. Please check the URL and try again.</p>
                            )}
                        </form>
                    )}
                </Card>
            </div>
        </Layout>
    )
}
