import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
    ok: boolean
    analytics?: {
        timeSeries: number[]
        countries: Record<string, number>
        devices: Record<string, number>
    }
    error?: string
}

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    const { id } = req.query

    if (req.method === 'GET') {
        // Mock analytics data based on ID
        return res.status(200).json({
            ok: true,
            analytics: {
                timeSeries: [10, 25, 15, 30, 45, 20, 60],
                countries: { US: 40, IN: 30, GB: 20, CA: 10 },
                devices: { Mobile: 60, Desktop: 35, Tablet: 5 },
            },
        })
    }

    res.status(405).json({ ok: false, error: 'Method not allowed' })
}
