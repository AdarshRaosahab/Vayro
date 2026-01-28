import { createOrder } from '../../../lib/payments'
import { getSession } from '../../../lib/sessions'
import { AuthError, AppError } from '../../../lib/errors'

export default async function handler(req: any, res: any) {
    console.log(`[CreateOrder] Method: ${req.method}`)

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
        // Auth check
        const cookieHeader = req.headers.cookie
        if (!cookieHeader) throw new AuthError()

        const cookies: { [key: string]: string } = {}
        cookieHeader.split(';').forEach((cookie: string) => {
            const parts = cookie.split('=')
            if (parts.length === 2) cookies[parts[0].trim()] = parts[1].trim()
        })

        const sessionId = cookies['vayro_session']
        if (!sessionId) throw new AuthError()

        const session = await getSession(sessionId)
        if (!session) throw new AuthError()

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
