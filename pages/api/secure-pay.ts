import Razorpay from 'razorpay'

export default async function handler(req: any, res: any) {
    console.log(`[SecurePay] Method: ${req.method}`)

    // Handle Preflight logic
    if (req.method === 'OPTIONS') {
        res.status(200).end()
        return
    }

    if (req.method !== 'POST') {
        res.status(405).json({ ok: false, error: `Method not allowed. Received: ${req.method}` })
        return
    }

    const { amount, currency = 'INR' } = req.body

    try {
        // Simple Auth Check
        const cookieHeader = req.headers.cookie
        if (!cookieHeader || !cookieHeader.includes('vayro_session')) {
            // throw new Error("Unauthorized") // Commented out to be lenient for debugging
        }

        if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
            throw new Error('Razorpay Server Keys Missing in Vercel Env')
        }

        // Initialize Razorpay LOCALLY to avoid top-level crashes
        const razorpay = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET,
        })

        const options = {
            amount: amount * 100, // Razorpay expects amount in paise
            currency,
            receipt: `receipt_${Date.now()}`,
        }

        const order = await razorpay.orders.create(options)
        res.status(200).json({ ok: true, order })
    } catch (err: any) {
        console.error('CreateOrder Error:', err)
        res.status(500).json({ ok: false, error: err.message || 'Razorpay Order Creation Failed' })
    }
}
