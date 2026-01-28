import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        res.status(200).json({ ok: true, message: 'Test Payment Endpoint Working' })
    } else {
        res.status(405).json({ ok: false, message: 'Method Not Allowed' })
    }
}
