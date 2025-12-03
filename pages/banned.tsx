import Layout from '../components/Layout'
import Link from 'next/link'

export default function BannedLink() {
    return (
        <Layout title="Link Banned - VAYRO">
            <div className="min-h-[60vh] flex items-center justify-center p-4">
                <div className="text-center max-w-lg">
                    <div className="w-24 h-24 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6 text-5xl animate-bounce">
                        🚫
                    </div>
                    <h1 className="text-4xl font-heading font-bold text-deepNavy mb-4">Link Banned</h1>
                    <p className="text-slate-600 text-lg mb-8">
                        This link has been disabled due to multiple reports of abuse or fraud.
                        Vayro is committed to keeping our users safe.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/" className="px-8 py-3 bg-deepNavy text-white font-bold rounded-full hover:bg-navy-800 transition-colors">
                            Go Home
                        </Link>
                        <Link href="/report" className="px-8 py-3 bg-white text-deepNavy border-2 border-slate-200 font-bold rounded-full hover:border-deepNavy transition-colors">
                            Report Issue
                        </Link>
                    </div>
                </div>
            </div>
        </Layout>
    )
}
