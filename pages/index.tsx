import QuickShorten from '@/components/QuickShorten'
import Layout from '@/components/Layout'

export default function Home() {
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

                    <div className="w-full">
                        <QuickShorten />
                    </div>
                </main>
            </div>
        </Layout>
    )
}
