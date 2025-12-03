import Layout from '../components/Layout'

export default function Privacy() {
    return (
        <Layout title="Privacy Policy - VAYRO">
            <div className="bg-deepNavy text-white py-16">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">Privacy Policy</h1>
                    <p className="text-slate-300 max-w-2xl mx-auto">How we collect, use, and protect your data.</p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12 -mt-8">
                <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 max-w-4xl mx-auto border border-slate-100">
                    <div className="prose prose-lg prose-slate max-w-none prose-headings:font-heading prose-headings:text-deepNavy prose-a:text-gold hover:prose-a:text-gold-600">
                        <p className="lead text-xl text-slate-600">Your privacy is important to us. It is VAYRO's policy to respect your privacy regarding any information we may collect from you across our website.</p>

                        <h3>1. Information We Collect</h3>
                        <p>We only ask for personal information when we truly need it to provide a service to you. We collect it by fair and lawful means, with your knowledge and consent.</p>

                        <h3>2. How We Use Information</h3>
                        <p>We use the information we collect to operate and maintain our website, send you emails, and improve your user experience.</p>

                        <h3>3. Security</h3>
                        <p>We value your trust in providing us your Personal Information, thus we are striving to use commercially acceptable means of protecting it.</p>
                    </div>
                </div>
            </div>
        </Layout>
    )
}
