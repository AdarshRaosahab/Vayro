import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import { Card } from '../components/Card'
import { Input } from '../components/Input'
import { ButtonPrimary } from '../components/ButtonPrimary'
import Link from 'next/link'
import { useRouter } from 'next/router'

export default function Register() {
    const [fullName, setFullName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    useEffect(() => {
        // Redirect if already logged in
        if (document.cookie.includes('vayro_auth_ui=true')) {
            router.push('/dashboard')
        }
    }, [])

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password, fullName }),
            })

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.error || 'Registration failed')
            }

            // Redirect to dashboard
            router.push('/dashboard')
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Layout title="Register - VAYRO">
            <div className="flex justify-center items-center min-h-[60vh] container mx-auto px-4 py-8">
                <Card className="w-full max-w-md p-8">
                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-heading font-bold text-deepNavy">Create Account</h1>
                        <p className="text-slateGray mt-2">Join VAYRO to manage your links</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="bg-red-50 text-red-600 text-sm p-3 rounded-md border border-red-100">
                                {error}
                            </div>
                        )}

                        <Input
                            label="Full Name"
                            type="text"
                            placeholder="John Doe"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            required
                        />

                        <Input
                            label="Email Address"
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />

                        <Input
                            label="Password"
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            minLength={8}
                        />

                        <ButtonPrimary type="submit" className="w-full" disabled={loading}>
                            {loading ? 'Creating Account...' : 'Sign Up'}
                        </ButtonPrimary>
                    </form>

                    <div className="mt-6 text-center text-sm text-slateGray">
                        Already have an account?{' '}
                        <Link href="/login" className="text-gold hover:text-deepNavy font-semibold transition-colors">
                            Log in
                        </Link>
                    </div>
                </Card>
            </div>
        </Layout>
    )
}
