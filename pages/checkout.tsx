import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
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
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [amount, setAmount] = useState(299)

    useEffect(() => {
        // Check if user is logged in
        fetch('/api/auth/me')
            .then(res => res.json())
            .then(data => {
                if (!data.ok) {
                    // Not logged in, redirect to login
                    router.push('/login?next=/checkout')
                }
            })
            .catch(() => { })

        if (router.isReady && router.query.test === 'true') {
            setAmount(1)
                < h1 className = "text-3xl font-heading font-bold text-deepNavy mb-4" > Upgrade to Premium</h1 >
                <p className="text-slateGray mb-8">
                    Unlock unlimited links, advanced analytics, and custom domains.
                </p>
                <div className="text-4xl font-bold text-gold mb-8">₹{amount}<span className="text-lg text-slateGray font-normal">/month</span></div>

                <ButtonPrimary onClick={handlePayment} className="w-full" disabled={loading}>
                    {loading ? 'Processing...' : 'Pay with Razorpay'}
                </ButtonPrimary>
                <p className="text-xs text-slateGray mt-4">
                    Secured by Razorpay. Supports UPI, Cards, Netbanking.
                </p>
            </Card >
        </div >
    </Layout >
)
}
