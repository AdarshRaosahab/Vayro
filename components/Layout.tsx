import Link from 'next/link'
import Head from 'next/head'
import { ReactNode } from 'react'
import Navbar from './Navbar'
import AdSlot from './AdSlot'

type Props = {
    children: ReactNode
    title?: string
    hideFooter?: boolean
}

export default function Layout({ children, title = 'VAYRO', hideFooter = false }: Props) {
    return (
        <div className="min-h-screen flex flex-col bg-ivory text-deepNavy font-sans">
            <Head>
                <title>{title === 'VAYRO' ? title : `${title} | VAYRO`}</title>
                <meta charSet="utf-8" />
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
            </Head>
            <Navbar />
            <main className="flex-1 w-full">
                {children}
            </main>

            {/* AdSlot for Free Users */}
            <div className="container mx-auto px-4 mb-8">
                <AdSlot slotId="1234567890" className="flex justify-center" />
            </div>

            {!hideFooter && (
                <footer className="bg-deepNavy text-white py-12 border-t border-slate-800">
                    <div className="container mx-auto px-4">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                            <div>
                                <h3 className="text-xl font-heading font-bold text-gold mb-4">VAYRO</h3>
                                <p className="text-slate-400 text-sm">
                                    The ultimate link management platform for modern brands.
                                </p>
                            </div>
                            <div>
                                <h4 className="font-bold mb-4">Product</h4>
                                <ul className="space-y-2 text-sm">
                                    <li><Link href="/features" className="text-slate-400 hover:text-gold transition-colors">Features</Link></li>
                                    <li><Link href="/pricing" className="text-slate-400 hover:text-gold transition-colors">Pricing</Link></li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-bold mb-4">Support</h4>
                                <ul className="space-y-2 text-sm">
                                    <li><Link href="/report" className="text-slate-400 hover:text-gold transition-colors">Report Abuse</Link></li>
                                    <li><Link href="/check" className="text-slate-400 hover:text-gold transition-colors">Safety Check</Link></li>
                                    <li><Link href="/contact" className="text-slate-400 hover:text-gold transition-colors">Contact Us</Link></li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-bold mb-4">Legal</h4>
                                <ul className="space-y-2 text-sm">
                                    <li><Link href="/terms" className="text-slate-400 hover:text-gold transition-colors">Terms of Service</Link></li>
                                    <li><Link href="/privacy" className="text-slate-400 hover:text-gold transition-colors">Privacy Policy</Link></li>
                                    <li><Link href="/refund-policy" className="text-slate-400 hover:text-gold transition-colors">Refund Policy</Link></li>
                                </ul>
                            </div>
                        </div>
                        <div className="text-center pt-8 border-t border-slate-800 text-slate-500 text-sm">
                            © {new Date().getFullYear()} VAYRO. All rights reserved.
                        </div>
                    </div>
                </footer>
            )}
        </div>
    )
}
