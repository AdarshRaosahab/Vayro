import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Layout from '@/components/Layout'
import { ButtonPrimary } from '@/components/ButtonPrimary'
import { Input } from '@/components/Input'
import { Card } from '@/components/Card'

export default function Login() {
    const router = useRouter()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        // Redirect if already logged in
        if (document.cookie.includes('vayro_auth_ui=true')) {
            router.push('/dashboard')
        }
    }, [])

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            })

            const data = await res.json()

            if (data.ok) {
                const next = router.query.next as string
                window.location.href = next || '/dashboard'
            } else {
                alert(data.error || data.message || 'Login failed')
            }
        } catch (error) {
            console.error('Login error:', error)
            alert('An error occurred during login.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <Layout title="Login - VAYRO">
            <div className="flex justify-center items-center min-h-[60vh] container mx-auto px-4 py-8">
                <Card className="w-full max-w-md p-8">
                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-heading font-bold text-deepNavy">Welcome Back</h1>
                        <p className="text-slateGray mt-2">Log in to manage your links</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
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
                        />

                        <ButtonPrimary type="submit" className="w-full" disabled={loading}>
                            {loading ? 'Logging in...' : 'Log In'}
                        </ButtonPrimary>
                    </form>

                    <div className="mt-6 text-center text-sm text-slateGray">
                        Don't have an account?{' '}
                        <a href="/register" className="text-gold hover:text-deepNavy font-semibold transition-colors">
                            Sign up
                        </a>
                    </div>
                </Card>
            </div>
        </Layout>
    )
}
