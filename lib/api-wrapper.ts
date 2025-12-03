import type { NextApiRequest, NextApiResponse } from 'next'
import { AppError, formatError } from './errors'
import { logError } from './logger'

type ApiHandler = (req: NextApiRequest, res: NextApiResponse) => Promise<void | any>

export function apiHandler(handler: ApiHandler) {
    return async (req: NextApiRequest, res: NextApiResponse) => {
        try {
            // CSRF Protection: Check Origin for mutating requests
            if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method || '')) {
                const origin = req.headers.origin
                const host = req.headers.host
                // Allow requests with no origin (server-to-server) or matching origin
                if (origin && host && !origin.includes(host)) {
                    throw new AppError('CSRF validation failed', 403)
                }
            }

            await handler(req, res)
        } catch (err) {
            // Log unexpected errors (non-operational)
            if (!(err instanceof AppError) || !err.isOperational) {
                logError(err, req.url)
            }

            const response = formatError(err)
            const statusCode = err instanceof AppError ? err.statusCode : 500

            res.status(statusCode).json(response)
        }
    }
}
