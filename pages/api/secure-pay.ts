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
