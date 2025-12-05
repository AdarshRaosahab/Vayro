import { createOrder } from '../../lib/payments'
import { AuthError, AppError } from '../../lib/errors'

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
        // Simple Auth Check (Cookie Existence only to prevent crash)
        // We skip getSession() because imports from 'lib/db' might be crashing Vercel
        const cookieHeader = req.headers.cookie
        if (!cookieHeader || !cookieHeader.includes('vayro_session')) {
            throw new AuthError()
        }

        if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
            throw new AppError('Razorpay Server Keys Missing', 500)
        }

        const order = await createOrder(amount, currency)
        res.status(200).json({ ok: true, order })
    } catch (err: any) {
        console.error('CreateOrder Error:', err)
        const statusCode = err.statusCode || 500
        res.status(statusCode).json({ ok: false, error: err.message || 'Razorpay Order Creation Failed' })
    }
}
