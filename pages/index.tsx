import { useState, useEffect } from 'react'
import Layout from '@/components/Layout'
import { ButtonPrimary } from '@/components/ButtonPrimary'
import { Input } from '@/components/Input'
import { Card } from '@/components/Card'

export default function Home() {
    const [longUrl, setLongUrl] = useState('')
    const [shortUrl, setShortUrl] = useState('')
    const [note, setNote] = useState('')
    const [loading, setLoading] = useState(false)
    const [user, setUser] = useState<any>(null)

    const [error, setError] = useState('')

    // Check user status on mount
    useEffect(() => {
        import('react').then(({ useEffect }) => {
            // Dynamic import workaround if needed, but standard useEffect is fine.
            // Actually I can just use the imported useEffect.
        })
        fetch('/api/auth/me')
            .then(res => res.json())
            .then(data => {
                if (data.ok) setUser(data.user)
            })
            .catch(() => { }) // Ignore errors if not logged in
    }, [])

    const handleShorten = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')
        try {
            const res = await fetch('/api/shorten', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ longUrl, note }),
            })
            const data = await res.json()
            if (data.ok) {
                setShortUrl(data.shortUrl)
            } else {
                setError(data.error || 'Something went wrong')
            }
        } catch (error) {
            console.error('Error shortening URL:', error)
            setError('Failed to shorten URL. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <Layout>
            <div className="flex flex-col items-center justify-center min-h-[60vh] py-2 container mx-auto px-4">
                <main className="flex flex-col items-center justify-center w-full max-w-2xl px-4 text-center">
                    <h1 className="text-5xl font-heading font-bold text-deepNavy mb-6">
                        Make your links <span className="text-gold">powerful</span>
                    </h1>
                    <p className="text-xl text-slateGray mb-10">
                        The premium URL shortener for modern brands.
                    </p>

                    <Card className="w-full">
                        <form onSubmit={handleShorten} className="space-y-4">
                            <Input
                                placeholder="Paste your long URL here..."
                                value={longUrl}
                                onChange={(e) => setLongUrl(e.target.value)}
                                required
                            />

                            {/* Premium Note Feature */}
                            {user?.plan === 'premium' && (
                                <div className="animate-in fade-in slide-in-from-top-2">
                                    <Input
                                        placeholder="Add a private note (Optional)"
                                        value={note}
                                        onChange={(e) => setNote(e.target.value)}
                                        className="text-sm"
                                    />
                                </div>
                            )}
                            {error && (
                                <p className="text-red-500 text-sm text-left">{error}</p>
                            )}
                            <ButtonPrimary type="submit" className="w-full" disabled={loading}>
                                {loading ? 'Shortening...' : 'Shorten URL'}
                            </ButtonPrimary>
                        </form>

                        {shortUrl && (
                            <div className="mt-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
                                <p className="text-sm text-slateGray mb-2">Your short link:</p>
                                <div className="flex items-center justify-center space-x-4">
                                    <a href={shortUrl} target="_blank" rel="noopener noreferrer" className="text-2xl font-bold text-deepNavy hover:text-gold transition-colors">
                                        {shortUrl}
                                    </a>
                                    <button
                                        onClick={() => navigator.clipboard.writeText(shortUrl)}
                                        className="text-sm text-gold font-bold hover:underline"
                                    >
                                        Copy
                                    </button>
                                </div>
                            </div>
                        )}
                    </Card>
                </main>
            </div>
        </Layout>
    )
}
