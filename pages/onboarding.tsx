import { useState, useEffect } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import OnboardStep from '../components/OnboardStep'
import OnboardProgress from '../components/OnboardProgress'
import { ButtonPrimary } from '../components/ButtonPrimary'
import { ButtonGhost } from '../components/ButtonGhost'
import { Input } from '../components/Input'
import QRPreview from '../components/QRPreview'
import Alert from '../components/Alert'

export default function Onboarding() {
    const router = useRouter()
    const [step, setStep] = useState(1)
    const [url, setUrl] = useState('')
    const [alias, setAlias] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [createdLink, setCreatedLink] = useState<any>(null)

    useEffect(() => {
        // Optional: Check if already onboarded and redirect
        fetch('/api/auth/me')
            .then(res => res.json())
            .then(data => {
                if (data.ok && data.user.onboardCompleted) {
                    router.replace('/dashboard')
                }
            })
            .catch(() => { })
    }, [])

    const handleSkip = async () => {
        try {
            await fetch('/api/user/onboard', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ onboardCompleted: true }),
            })
            router.push('/dashboard')
        } catch (err) {
            console.error(err)
            router.push('/dashboard') // Fallback
        }
    }

    const handleCreateLink = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            const res = await fetch('/api/shorten', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url, alias: alias || undefined }),
            })
            const data = await res.json()

            if (data.ok) {
                setCreatedLink(data)
                setStep(3) // Skip to success step
            } else {
                setError(data.error || 'Failed to create link')
            }
        } catch (err) {
            setError('Something went wrong')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-ivory flex flex-col items-center justify-center p-4">
            <Head>
                <title>Welcome to VAYRO</title>
            </Head>

            <div className="w-full max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-12 px-4">
                    <div className="text-2xl font-heading font-bold text-deepNavy tracking-tight">VAYRO</div>
                    <button onClick={handleSkip} className="text-slateGray hover:text-deepNavy font-medium text-sm">
                        Skip for now
                    </button>
                </div>

                <OnboardProgress currentStep={step} totalSteps={3} />

                {step === 1 && (
                    <OnboardStep
                        title="Let's get started"
                        subtitle="Paste a long URL to create your first short link."
                    >
                        <form onSubmit={(e) => { e.preventDefault(); setStep(2); }} className="space-y-6">
                            <Input
                                label="Destination URL"
                                placeholder="https://example.com/very/long/url..."
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                required
                                autoFocus
                            />
                            <ButtonPrimary type="submit" className="w-full" disabled={!url}>
                                Continue
                            </ButtonPrimary>
                        </form>
                    </OnboardStep>
                )}

                {step === 2 && (
                    <OnboardStep
                        title="Customize it"
                        subtitle="Give your link a custom alias (optional)."
                    >
                        {error && <Alert type="error" message={error} />}
                        <form onSubmit={handleCreateLink} className="space-y-6">
                            <Input
                                label="Custom Alias (Optional)"
                                placeholder="my-first-link"
                                value={alias}
                                onChange={(e) => setAlias(e.target.value)}
                            />
                            <div className="flex space-x-4">
                                <ButtonGhost type="button" onClick={() => setStep(1)} className="w-1/3">
                                    Back
                                </ButtonGhost>
                                <ButtonPrimary type="submit" className="w-2/3" disabled={loading}>
                                    {loading ? 'Creating...' : 'Create Link'}
                                </ButtonPrimary>
                            </div>
                        </form>
                    </OnboardStep>
                )}

                {step === 3 && createdLink && (
                    <OnboardStep
                        title="Success!"
                        subtitle="Your first link is ready."
                    >
                        <div className="text-center space-y-6">
                            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                                <p className="text-sm text-slateGray mb-1">Short Link</p>
                                <a
                                    href={createdLink.shortUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xl font-bold text-deepNavy hover:text-gold transition-colors"
                                >
                                    vayro.app/{createdLink.code}
                                </a>
                            </div>

                            <div className="flex justify-center">
                                <QRPreview code={createdLink.code} size={150} />
                            </div>

                            <div className="space-y-3 pt-4">
                                <ButtonPrimary onClick={handleSkip} className="w-full">
                                    Go to Dashboard
                                </ButtonPrimary>
                                <button
                                    onClick={() => router.push('/checkout')}
                                    className="w-full py-2 text-gold font-semibold hover:text-deepNavy transition-colors text-sm"
                                >
                                    Upgrade to Premium
                                </button>
                            </div>
                        </div>
                    </OnboardStep>
                )}
            </div>
        </div>
    )
}
