import Layout from '../components/Layout'

export default function Contact() {
    return (
        <Layout title="Contact Us - VAYRO">
            <div className="container mx-auto px-4 py-12 max-w-3xl">
                <h1 className="text-4xl font-bold text-deepNavy mb-8">Contact Us</h1>
                <div className="prose prose-slate">
                    <p>We'd love to hear from you. Please reach out to us at:</p>

                    <div className="bg-slate-50 p-6 rounded-lg border border-slate-200 mt-6">
                        <p className="font-semibold">Email:</p>
                        <p className="text-deepNavy mb-4">
                            <a href="mailto:support@vayro.in" className="text-gold hover:underline">support@vayro.in</a>
                            <br />
                            <span className="text-sm text-slateGray">Founder: <a href="mailto:adarshyadav8368@zohomail.in" className="hover:underline">adarshyadav8368@zohomail.in</a></span>
                        </p>

                        <p className="font-semibold">Address:</p>
                        <p className="text-deepNavy">
                            Vayro HQ<br />
                            New Delhi, India<br />
                            110084
                        </p>
                    </div>
                </div>
            </div>
        </Layout>
    )
}
