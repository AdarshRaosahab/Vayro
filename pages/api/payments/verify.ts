import { NextApiRequest, NextApiResponse } from 'next'
import crypto from 'crypto'
import { db } from '../../../lib/db'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    console.log(`[Verify] Method: ${req.method}`)

    if (req.method !== 'POST') {
        return res.status(405).json({ ok: false, error: 'Method not allowed' })
    }

    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body

        // 1. Validate Input
        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            console.error('Missing required payment fields')
            return res.status(400).json({ ok: false, error: 'Invalid Payment Data' })
        }

        // 2. Validate Signature
        const secret = process.env.RAZORPAY_KEY_SECRET
        if (!secret) {
            console.error('RAZORPAY_KEY_SECRET is missing')
            return res.status(500).json({ ok: false, error: 'Server Configuration Error' })
        }

        const generated_signature = crypto
            .createHmac('sha256', secret)
            .update(razorpay_order_id + '|' + razorpay_payment_id)
            .digest('hex')

        if (generated_signature !== razorpay_signature) {
            console.error('Signature Mismatch')
            return res.status(400).json({ ok: false, error: 'Payment Verification Failed' })
        }

        // 3. User Activation (Upgrade to Premium)
        // Extract session manually to avoid imports
        const cookieHeader = req.headers.cookie
        let userId = null

        if (cookieHeader) {
            const cookies: { [key: string]: string } = {}
            cookieHeader.split(';').forEach((cookie) => {
                const parts = cookie.split('=')
                if (parts.length === 2) cookies[parts[0].trim()] = parts[1].trim()
            })
            const sessionId = cookies['vayro_session']

            if (sessionId) {
                const session = await db.session.findUnique({
                    where: { id: sessionId },
                    select: { userId: true, expiresAt: true }
                })

                if (session && session.expiresAt > new Date()) {
                    userId = session.userId
                }
            }
        }

        if (userId) {
            await db.user.update({
                where: { id: userId },
                data: { plan: 'premium' }
            })
            console.log(`User ${userId} upgraded to premium`)
        } else {
            console.warn('Payment verified but NO USER SESSION found to upgrade.')
            // We still return success because the payment WAS valid. 
            // The user might need to contact support or we can rely on webhook later.
        }

        return res.status(200).json({ ok: true, verified: true })

    } catch (error: any) {
        console.error('Verification Error:', error)
        return res.status(500).json({ ok: false, error: error.message || 'Internal Server Error' })
    }
}
