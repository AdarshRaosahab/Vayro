import { apiHandler } from '../../../lib/api-wrapper'
import { createOrder } from '../../../lib/payments'
import { getSession } from '../../../lib/sessions'
import { AuthError, AppError } from '../../../lib/errors'

export default apiHandler(async (req, res) => {
    console.log(`[CreateOrder] Method: ${req.method}`)

    // Handle Preflight logic
    if (req.method === 'OPTIONS') {
        res.status(200).end()
        return
    }

    if (req.method !== 'POST') {
        throw new AppError(`Method not allowed. Received: ${req.method}`, 405)
    }

    const { amount, currency = 'INR' } = req.body

    // Auth check
    const cookieHeader = req.headers.cookie
    if (!cookieHeader) throw new AuthError()

    const cookies: { [key: string]: string } = {}
    cookieHeader.split(';').forEach((cookie) => {
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

    try {
        const order = await createOrder(amount, currency)
        res.status(200).json({ ok: true, order })
    } catch (err: any) {
        throw new AppError(err.message || 'Razorpay Order Creation Failed', 500)
    }
})
