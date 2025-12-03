import Layout from '@/components/Layout'
import Link from 'next/link'

import { useEffect } from 'react'
import { useRouter } from 'next/router'

export default function Features() {
    const router = useRouter()

    useEffect(() => {
        // Check if user is premium and redirect
        // We use the API check here for robustness
        fetch('/api/auth/me')
            .then(res => res.json())
            .then(data => {
                if (data.ok && data.user.plan === 'premium') {
                    router.push('/dashboard')
                }
            })
            .catch(() => { })
    }, [])

    return (
        <Layout title="Features - VAYRO">
            {/* Hero Section - Full Width */}
            <div className="bg-deepNavy text-ivory py-20">
                <div className="container mx-auto px-4 text-center flex flex-col items-center">
                    <h1 className="text-4xl md:text-5xl font-heading font-bold mb-6">
                        Powerful Features for <span className="text-gold">MODERN BRANDING</span>
                    </h1>
                    <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-10">
                        Everything you need to manage your links, track your audience, and grow your brand.
                    </p>
                    <Link
                        href="/register"
                        className="bg-gold-500 text-white font-medium py-3 px-8 rounded-md shadow-sm hover:bg-gold-600 hover:shadow-md active:transform active:scale-[0.98] transition-all duration-200 ease-in-out inline-flex items-center justify-center text-lg"
                    >
                        Get Started for Free
                    </Link>
                </div>
            </div>

            {/* Feature Grid - Contained */}
            <div className="container mx-auto px-4 py-20">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    <FeatureCard
                        icon="⚡"
                        title="Lightning Fast"
                        description="Redirects that happen in milliseconds. Our infrastructure is optimized for speed."
                    />
                    <FeatureCard
                        icon="📊"
                        title="Advanced Analytics"
                        description="Track clicks, location, device types, and more with our detailed analytics dashboard."
                    />
                    <FeatureCard
                        icon="🎨"
                        title="Custom Branding"
                        description="Use your own domain name and customize your QR codes to match your brand identity."
                    />
                </div>
            </div>

            {/* Safety Section - Premium Design */}
            <div className="relative py-24 bg-slate-50 overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#ef4444 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>

                <div className="container mx-auto px-4 relative z-10">
                    <div className="text-center mb-20">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-50 border border-red-100 text-red-600 text-xs font-bold uppercase tracking-wider mb-6">
                            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                            Enterprise Grade Protection
                        </div>
                        <h2 className="text-4xl md:text-5xl font-heading font-bold text-deepNavy mb-6">
                            Unmatched <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-600">Safety & Security</span>
                        </h2>
                        <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
                            We've built a fortress around your links. Vayro uses advanced fraud detection and proactive blocking to ensure every click is safe.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <SafetyCard
                            icon="🛡️"
                            title="Proactive Blocking"
                            description={<>Automatically blocks <strong>suspicious keywords</strong> (like "login", "bank") and <strong>malicious domains</strong> to prevent fraud before it happens.</>}
                        />
                        <SafetyCard
                            icon="🚨"
                            title="Community Reporting"
                            description={<>Empowers users to <strong>report abuse</strong> instantly. Our community helps keep the platform clean and safe for everyone.</>}
                        />
                        <SafetyCard
                            icon="🚫"
                            title="Auto-Ban System"
                            description={<>Links with verified reports are <strong>automatically banned</strong>. Repeat offenders get their accounts <strong>suspended</strong>.</>}
                        />
                        <SafetyCard
                            icon="👁️"
                            title="Safety Preview"
                            description={<>Inspect any link before clicking. Simply add a <strong>+</strong> to the end of any URL to see a <strong>full safety preview</strong>.</>}
                        />
                    </div>
                </div>
            </div>

            {/* CTA Section - Full Width */}
            <div className="bg-ivory-200 py-20">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl font-heading font-bold text-deepNavy mb-6">Ready to upgrade your links?</h2>
                    <Link
                        href="/register"
                        className="bg-gold-500 text-white font-medium py-2 px-6 rounded-md shadow-sm hover:bg-gold-600 hover:shadow-md active:transform active:scale-[0.98] transition-all duration-200 ease-in-out inline-flex items-center justify-center"
                    >
                        Start Your Free Trial
                    </Link>
                </div>
            </div>
        </Layout>
    )
}

function FeatureCard({ icon, title, description }: { icon: string, title: string, description: string }) {
    return (
        <div className="group relative p-8 rounded-2xl bg-white border border-slate-100 shadow-lg hover:shadow-2xl transition-all duration-300 ease-out hover:-translate-y-2 overflow-hidden text-center">
            {/* Decorative Top Gradient */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gold-300 via-gold-500 to-gold-300 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>

            {/* Icon Container */}
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-br from-ivory-100 to-ivory-200 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-300 border border-slate-100">
                <span className="text-4xl filter drop-shadow-sm">{icon}</span>
            </div>

            <h3 className="text-2xl font-heading font-bold text-deepNavy mb-4 group-hover:text-gold-600 transition-colors duration-300">
                {title}
            </h3>

            <p className="text-slate-600 leading-relaxed">
                {description}
            </p>
        </div>
    )
}

function SafetyCard({ icon, title, description }: { icon: string, title: string, description: React.ReactNode }) {
    return (
        <div className="group relative bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-red-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl"></div>

            {/* Icon */}
            <div className="relative w-14 h-14 bg-red-50 rounded-xl flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform duration-300 shadow-inner">
                {icon}
            </div>

            {/* Content */}
            <h3 className="relative text-xl font-heading font-bold text-deepNavy mb-3 group-hover:text-red-600 transition-colors">
                {title}
            </h3>
            <p className="relative text-slate-600 text-sm leading-relaxed">
                {description}
            </p>
        </div>
    )
}
