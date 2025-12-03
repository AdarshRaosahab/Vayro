import Layout from '../components/Layout'

export default function Terms() {
    return (
        <Layout title="Terms of Service - VAYRO">
            <div className="bg-deepNavy text-white py-16">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">Terms of Service</h1>
                    <p className="text-slate-300 max-w-2xl mx-auto">Please read these terms carefully before using our service.</p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12 -mt-8">
                <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 max-w-4xl mx-auto border border-slate-100">
                    <div className="prose prose-lg prose-slate max-w-none prose-headings:font-heading prose-headings:text-deepNavy prose-a:text-gold hover:prose-a:text-gold-600">
                        <p className="lead text-xl text-slate-600">Welcome to VAYRO. By using our website and services, you agree to these Terms of Service.</p>

                        <h3>1. Usage</h3>
                        <p>You agree to use VAYRO only for lawful purposes and in a way that does not infringe the rights of, restrict or inhibit anyone else's use and enjoyment of the website.</p>

                        <h3>2. Accounts</h3>
                        <p>When you create an account with us, you must provide us information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms.</p>

                        <h3>3. Termination</h3>
                        <p>We may terminate or suspend access to our Service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.</p>

                        <h3>4. Changes</h3>
                        <p>We reserve the right, at our sole discretion, to modify or replace these Terms at any time.</p>
                    </div>
                </div>
            </div>
        </Layout>
    )
}
