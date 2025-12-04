import { NextApiRequest, NextApiResponse } from 'next'
import { db } from '../../lib/db'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        // 1. Check Environment Variables
        const dbUrl = process.env.DATABASE_URL
        const hasDbUrl = !!dbUrl
        const isPostgres = dbUrl?.startsWith('postgres')

        // 2. Check Database Connection
        let dbStatus = 'unknown'
        let userCount = -1
        try {
            userCount = await db.user.count()
            dbStatus = 'connected'
        } catch (e: any) {
            dbStatus = `error: ${e.message}`
        }

        res.status(200).json({
            status: 'ok',
            env: {
                hasDatabaseUrl: hasDbUrl,
                isPostgres: isPostgres,
                nodeEnv: process.env.NODE_ENV,
                vercelEnv: process.env.VERCEL_ENV || 'unknown',
                projectName: process.env.VERCEL_PROJECT_NAME || 'unknown',
                projectId: process.env.VERCEL_PROJECT_ID || 'unknown',
                allKeys: Object.keys(process.env).filter(k => !k.includes('SECRET') && !k.includes('KEY') && !k.includes('PASSWORD')), // List keys for debugging, excluding secrets
            },
            database: {
                status: dbStatus,
                userCount,
            },
            timestamp: new Date().toISOString(),
        })
    } catch (error: any) {
        res.status(500).json({
            status: 'error',
            message: error.message,
        })
    }
}
