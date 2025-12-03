import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '../../lib/db'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        // Check DB connection
        await db.$queryRaw`SELECT 1`

        res.status(200).json({
            status: 'ok',
            database: 'connected',
            redis: process.env.REDIS_URL ? 'configured' : 'disabled'
        })
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Database connection failed'
        })
    }
}
