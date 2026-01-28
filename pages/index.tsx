import Head from 'next/head'
import Link from 'next/link'
import QuickShorten from '../components/QuickShorten'

export default function Home() {
    return (
        <div className="min-h-screen bg-ivory-50 flex flex-col font-sans">
            <Head>
                <title>Vayro - High-Performance URL Shortener</title>
                <meta name="description" content="The fastest URL shortener with real-time analytics." />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            {/* Header */}
            <header className="p-6 flex justify-between items-center bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100">
                <div className="text-2xl font-heading font-black tracking-tight text-navy-900">
                    VAYRO<span className="text-gold-500">.</span>
                </div>
                <nav className="hidden md:flex gap-8 text-sm font-semibold text-navy-700">
                    <Link href="#features" className="hover:text-gold-600 transition-colors">Features</Link>
                    <Link href="#pricing" className="hover:text-gold-600 transition-colors">Pricing</Link>
                    <Link href="#enterprise" className="hover:text-gold-600 transition-colors">Enterprise</Link>
                </nav>
                <div className="flex gap-4">
                    <Link href="/login" className="px-5 py-2.5 text-navy-700 font-bold hover:text-navy-900 transition-colors">
                        Log in
                    </Link>
                    <Link href="/dashboard" className="px-5 py-2.5 bg-navy-900 text-gold-500 font-bold rounded-lg hover:bg-navy-800 transition-all shadow-lg hover:shadow-navy-900/20">
                        Start for Free
                    </Link>
                </div>
            </header>

            <main className="flex-1">
                {/* Hero Section */}
                <section className="relative px-6 pt-20 pb-32 text-center bg-gradient-to-b from-ivory-50 to-ivory-100 overflow-hidden">

                    {/* Background decoration */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none opacity-40">
                        <div className="absolute top-20 left-10 w-72 h-72 bg-gold-200 rounded-full blur-3xl opacity-30 animate-pulse"></div>
                        <div className="absolute bottom-20 right-10 w-96 h-96 bg-navy-200 rounded-full blur-3xl opacity-30"></div>
                    </div>

                    <div className="relative z-10 max-w-4xl mx-auto">
                        <div className="inline-block px-4 py-1.5 mb-6 rounded-full bg-gold-100 text-gold-600 text-xs font-bold uppercase tracking-widest border border-gold-200">
                            Version 2.0 is Live
                        </div>
                        <h1 className="text-5xl md:text-7xl font-heading font-extrabold text-navy-900 leading-tight mb-8">
                            Shorten Links.<br />
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-gold-500 to-gold-600">
                                Expand Reach.
                            </span>
                        </h1>
                        <p className="text-xl text-slate-600 mb-12 max-w-2xl mx-auto leading-relaxed">
                            Vayro is the enterprise-grade URL shortener built for speed.
                            Get sub-millisecond redirects and real-time analytics.
                        </p>

                        <div className="mb-16">
                            <QuickShorten />
                        </div>

                        <div className="flex flex-col md:flex-row justify-center gap-6 text-sm font-semibold text-slate-500">
                            <div className="flex items-center gap-2">
                                <svg className="w-5 h-5 text-gold-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                                Free Unlimited Links
                            </div>
                            <div className="flex items-center gap-2">
                                <svg className="w-5 h-5 text-gold-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                                Real-time Analytics
                            </div>
                            <div className="flex items-center gap-2">
                                <svg className="w-5 h-5 text-gold-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                                No Credit Card Required
                            </div>
                        </div>
                    </div>
                </section>

                {/* Feature Grid / Preview */}
                <section id="features" className="py-24 bg-white relative z-20">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="grid md:grid-cols-3 gap-12">
                            {/* Feature 1 */}
                            <div className="p-8 rounded-2xl bg-ivory-50 border border-ivory-200 hover:border-gold-300 transition-all group">
                                <div className="w-12 h-12 bg-navy-900 rounded-lg flex items-center justify-center mb-6 text-gold-500 group-hover:scale-110 transition-transform">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                                </div>
                                <h3 className="text-xl font-bold text-navy-900 mb-3">Lightning Fast</h3>
                                <p className="text-slate-600">Built on Redis and Edge functionality to ensure your users never verify wait.</p>
                            </div>
                            {/* Feature 2 */}
                            <div className="p-8 rounded-2xl bg-ivory-50 border border-ivory-200 hover:border-gold-300 transition-all group">
                                <div className="w-12 h-12 bg-navy-900 rounded-lg flex items-center justify-center mb-6 text-gold-500 group-hover:scale-110 transition-transform">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                                </div>
                                <h3 className="text-xl font-bold text-navy-900 mb-3">Deep Analytics</h3>
                                <p className="text-slate-600">Know exactly where your traffic comes from with country, device, and referrer data.</p>
                            </div>
                            {/* Feature 3 */}
                            <div className="p-8 rounded-2xl bg-ivory-50 border border-ivory-200 hover:border-gold-300 transition-all group">
                                <div className="w-12 h-12 bg-navy-900 rounded-lg flex items-center justify-center mb-6 text-gold-500 group-hover:scale-110 transition-transform">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                                </div>
                                <h3 className="text-xl font-bold text-navy-900 mb-3">Enterprise Security</h3>
                                <p className="text-slate-600">SSO, custom domains, and link expiration. Everything you need to scale safely.</p>
                            </div>
                        </div>
                    </div>
                </section>

            </main>

            <footer className="bg-navy-900 text-ivory-300 py-12 border-t border-navy-800">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <p className="mb-4">&copy; {new Date().getFullYear()} Vayro Inc.</p>
                    <p className="text-sm text-slate-500">Designed for Performance.</p>
                </div>
            </footer>
        </div>
    )
}
