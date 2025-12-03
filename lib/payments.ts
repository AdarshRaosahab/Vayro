import Razorpay from 'razorpay'
import crypto from 'crypto'

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || '',
    key_secret: process.env.RAZORPAY_KEY_SECRET || '',
})

export default razorpay

export async function createOrder(amount: number, currency: string = 'INR') {
    const options = {
        amount: amount * 100, // Razorpay expects amount in paise
        currency,
        receipt: `receipt_${Date.now()}`,
    }
    return razorpay.orders.create(options)
}

export async function createSubscription(planId: string, totalCount: number = 12) {
    const options = {
        plan_id: planId,
        total_count: totalCount,
        quantity: 1,
        customer_notify: 1 as any,
    }
    return razorpay.subscriptions.create(options)
}

export function verifySignature(body: string, signature: string, secret: string) {
    const expectedSignature = crypto
        .createHmac('sha256', secret)
        .update(body)
        .digest('hex')
    return expectedSignature === signature
}
