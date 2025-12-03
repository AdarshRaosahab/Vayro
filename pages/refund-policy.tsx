import Layout from '../components/Layout'

export default function RefundPolicy() {
    return (
        <Layout title="Refund Policy - VAYRO">
            <div className="bg-deepNavy text-white py-16">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">Refund & Cancellation Policy</h1>
                    <p className="text-slate-300 max-w-2xl mx-auto">Our commitment to customer satisfaction.</p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12 -mt-8">
                <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 max-w-4xl mx-auto border border-slate-100">
                    <div className="prose prose-lg prose-slate max-w-none prose-headings:font-heading prose-headings:text-deepNavy prose-a:text-gold hover:prose-a:text-gold-600">

                        <h3>1. Refunds</h3>
                        <p>We offer a 14-day money-back guarantee for our premium plans. If you are not satisfied with the service, you can request a full refund within 14 days of your purchase.</p>

                        <h3>2. Cancellations</h3>
                        <p>You can cancel your subscription at any time. Your access to premium features will continue until the end of your current billing period.</p>

                        <h3>3. Contact Us</h3>
                        <p>If you have any questions about our Returns and Refunds Policy, please contact us.</p>
                    </div>
                </div>
            </div>
        </Layout>
    )
}
