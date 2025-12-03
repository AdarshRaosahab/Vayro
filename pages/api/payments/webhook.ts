import { apiHandler } from '../../../lib/api-wrapper'
import { db } from '../../../lib/db'
import crypto from 'crypto'
import { AppError } from '../../../lib/errors'

export const config = {
    api: {
        bodyParser: false,
    },
}

async function getRawBody(req: any): Promise<string> {
    const chunks = []
    for await (const chunk of req) {
        chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk)
    }
    return Buffer.concat(chunks).toString('utf8')
}

export default apiHandler(async (req, res) => {
    if (req.method !== 'POST') {
        throw new AppError('Method not allowed', 405)
    }

    const secret = process.env.RAZORPAY_WEBHOOK_SECRET
    if (!secret) throw new AppError('Webhook secret not configured', 500)

    const signature = req.headers['x-razorpay-signature'] as string
    const rawBody = await getRawBody(req)
    const expectedSignature = crypto.createHmac('sha256', secret).update(rawBody).digest('hex')

    if (signature !== expectedSignature) {
        throw new AppError('Invalid webhook signature', 400)
    }

    const event = JSON.parse(rawBody)

    // Idempotency: In a real app, store event.id in DB to prevent duplicates
    // For now, we rely on the fact that updating status to 'active' is idempotent-ish

    if (event.event === 'payment.captured') {
        const { notes } = event.payload.payment.entity
        if (notes && notes.userId) {
            // One-time payment logic (if applicable)
        }
    } else if (event.event === 'subscription.charged') {
        const { subscription_id } = event.payload.subscription.entity
        // Find user by subscription ID and update plan
        // This assumes we stored the subscription ID when creating it
        // await db.user.updateMany({
        //    where: { subscriptionId: subscription_id },
        //    data: { plan: 'premium' }
        // })
    }

    res.status(200).json({ ok: true })
})
