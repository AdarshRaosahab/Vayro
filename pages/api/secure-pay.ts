import { NextApiRequest, NextApiResponse } from 'next'

// Simplified to debug if Imports are causing the crash
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    console.log(`[SecurePay] Method: ${req.method}`)

    if (req.method === 'OPTIONS') {
        res.status(200).end()
        return
    }

    if (req.method === 'POST') {
        res.status(200).json({ ok: true, message: 'Secure Pay Endpoint Reachable (Logic Disabled)' })
    } else {
        res.status(405).json({ ok: false, message: 'Method Not Allowed' })
    }
}
