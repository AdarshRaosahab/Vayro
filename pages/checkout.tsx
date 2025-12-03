import { useState } from 'react'
import Layout from '../components/Layout'
import { Card } from '../components/Card'
import { ButtonPrimary } from '../components/ButtonPrimary'
import Script from 'next/script'

declare global {
    interface Window {
        Razorpay: any
    }
}

export default function Checkout() {
    const [loading, setLoading] = useState(false)

    const handlePayment = async () => {
        setLoading(true)
        try {
            // Create Order
            const res = await fetch('/api/payments/create-order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount: 299 }), // Example amount 299 INR
            })
            const data = await res.json()

            if (!data.ok) {
                alert('Failed to create order')
                setLoading(false)
                return
            }

            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                amount: data.order.amount,
                currency: data.order.currency,
                name: 'VAYRO Premium',
                description: 'Upgrade to VAYRO Premium',
                order_id: data.order.id,
                handler: async function (response: any) {
                    // Verify Payment
                    const verifyRes = await fetch('/api/payments/verify', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                        }),
                    })
                    const verifyData = await verifyRes.json()
                    if (verifyData.ok) {
                        alert('Payment Successful! You are now a Premium member.')
                        window.location.href = '/dashboard'
                    } else {
                        alert('Payment Verification Failed')
                    }
                },
                prefill: {
                    name: 'VAYRO User',
                    email: 'user@vayro.io',
                    contact: '9999999999',
                },
                theme: {
                    color: '#0A1A2F',
                },
            }

            const rzp1 = new window.Razorpay(options)
            rzp1.open()
        } catch (error) {
            console.error('Payment failed', error)
            alert('Something went wrong')
        } finally {
            setLoading(false)
        }
    }

    return (
        <Layout title="Checkout - VAYRO">
            <Script src="https://checkout.razorpay.com/v1/checkout.js" />
            <div className="flex justify-center items-center min-h-[60vh]">
                <Card className="w-full max-w-md p-8 text-center">
                    <h1 className="text-3xl font-heading font-bold text-deepNavy mb-4">Upgrade to Premium</h1>
                    <p className="text-slateGray mb-8">
                        Unlock unlimited links, advanced analytics, and custom domains.
                    </p>
                    <div className="text-4xl font-bold text-gold mb-8">₹299<span className="text-lg text-slateGray font-normal">/month</span></div>

                    <ButtonPrimary onClick={handlePayment} className="w-full" disabled={loading}>
                        {loading ? 'Processing...' : 'Pay with Razorpay'}
                    </ButtonPrimary>
                    <p className="text-xs text-slateGray mt-4">
                        Secured by Razorpay. Supports UPI, Cards, Netbanking.
                    </p>
                </Card>
            </div>
        </Layout>
    )
}
