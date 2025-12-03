import Link from 'next/link'
import { ButtonGold } from './ButtonGold'
import { ButtonGhost } from './ButtonGhost'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

export default function Navbar() {
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [userPlan, setUserPlan] = useState<string | null>(null)
    const [userRole, setUserRole] = useState<string | null>(null)
    const router = useRouter()

    useEffect(() => {
        checkAuth()
    }, [])

    const checkAuth = async () => {
        // 1. Check for UI cookie first (fast)
        if (document.cookie.includes('vayro_auth_ui=true')) {
            setIsLoggedIn(true)
            // We still need to fetch the plan if we want to hide the link correctly
            // But we can do it lazily or just fetch it always for now to be safe
        }

        // Always fetch me to get the plan
        try {
            const res = await fetch('/api/auth/me')
            const data = await res.json()
            if (data.ok) {
                setIsLoggedIn(true)
                setUserPlan(data.user.plan)
                setUserRole(data.user.role)
                // Set UI cookie for future page loads
                document.cookie = 'vayro_auth_ui=true; path=/; max-age=2592000' // 30 days
            }
        } catch (error) {
            console.error('Auth check failed', error)
        }
    }

    const handleLogout = async () => {
        try {
            await fetch('/api/auth/logout', { method: 'POST' })
            setIsLoggedIn(false)
            setUserPlan(null)
            setUserRole(null)
            // Clear UI cookie
            document.cookie = 'vayro_auth_ui=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT'
            router.push('/login')
        } catch (error) {
            console.error('Logout failed', error)
        }
    }

    return (
        <nav className="bg-deepNavy text-white py-4 shadow-md">
            <div className="container mx-auto px-4 relative flex justify-between items-center">
                <Link href="/" className="flex items-center space-x-2 z-10">
                    {/* Logo */}
                    <img src="/logo.png" alt="Vayro Logo" className="w-8 h-8 object-contain" />
                    <span className="text-2xl font-heading font-bold text-ivory tracking-wide">VAYRO</span>
                </Link>

                {/* Centered Links */}
                <div className="hidden md:flex items-center space-x-6 absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    {isLoggedIn && (
                        <Link href="/dashboard" className="text-slate-300 hover:text-gold transition-colors">Dashboard</Link>
                    )}
                    {/* Admin Link */}
                    {isLoggedIn && userRole === 'ADMIN' && (
                        <Link href="/admin/dashboard" className="text-red-400 hover:text-red-300 transition-colors font-bold">Admin</Link>
                    )}
                    {/* Only show Features to non-premium users (or not logged in) */}
                    {(!isLoggedIn || userPlan !== 'premium') && (
                        <Link href="/features" className="text-slate-300 hover:text-gold transition-colors">Features</Link>
                    )}
                    <Link href="/pricing" className="text-slate-300 hover:text-gold transition-colors">Pricing</Link>
                </div>

                <div className="flex items-center space-x-4 z-10">
                    {isLoggedIn ? (
                        <button
                            onClick={handleLogout}
                            className="text-slate-300 hover:text-white transition-colors"
                        >
                            Log out
                        </button>
                    ) : (
                        <>
                            <Link href="/login">
                                <ButtonGhost className="text-white hover:bg-white/10 hover:text-white py-2 px-4">Log in</ButtonGhost>
                            </Link>
                            <Link href="/register">
                                <ButtonGold className="py-2 px-4 text-sm">Get Started</ButtonGold>
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    )
}
