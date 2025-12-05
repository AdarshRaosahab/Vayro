import Layout from '../components/Layout'

export default function ShippingPolicy() {
    return (
        <Layout title="Shipping & Delivery Policy - VAYRO">
            <div className="container mx-auto px-4 py-12 max-w-3xl">
                <h1 className="text-4xl font-bold text-deepNavy mb-8">Shipping & Delivery Policy</h1>
                <div className="prose prose-slate">
                    <p className="text-lg mb-6">Last updated: {new Date().toLocaleDateString()}</p>

                    <h3 className="text-xl font-bold text-deepNavy mt-8 mb-4">Digital Products</h3>
                    <p>
                        VAYRO is a SaaS (Software as a Service) platform. We provide digital services including URL shortening,
                        QR code generation, and analytics.
                    </p>
                    <p>
                        <strong>There are no physical products to ship.</strong> All services are delivered instantly online
                        upon account creation or subscription activation.
                    </p>

                    <h3 className="text-xl font-bold text-deepNavy mt-8 mb-4">Delivery Timeline</h3>
                    <ul className="list-disc pl-6 space-y-2">
                        <li><strong>Free Plan:</strong> Instant access upon registration.</li>
                        <li><strong>Premium Plan:</strong> Instant access to premium features upon successful payment confirmation.</li>
                    </ul>

                    <h3 className="text-xl font-bold text-deepNavy mt-8 mb-4">Contact Us</h3>
                    <p>
                        If you have any issues with accessing our services, please contact us at{' '}
                        <a href="mailto:support@vayro.in" className="text-gold hover:underline">support@vayro.in</a>.
                    </p>
                </div>
            </div>
        </Layout>
    )
}
