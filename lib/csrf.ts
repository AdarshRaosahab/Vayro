import { NextApiRequest, NextApiResponse } from 'next'
import { AppError } from './errors'
import { serialize } from 'cookie'
import crypto from 'crypto'

const CSRF_COOKIE_NAME = 'vayro_csrf'

export const csrf = {
    /**
     * Sets a CSRF token cookie and returns the token value.
     * Call this on initial page load or login.
     */
    setup(res: NextApiResponse): string {
        const token = crypto.randomBytes(32).toString('hex')
        const cookie = serialize(CSRF_COOKIE_NAME, token, {
            httpOnly: false, // Must be readable by JS to send in header
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
        })
        res.setHeader('Set-Cookie', cookie)
        return token
    },

    /**
     * Verifies the CSRF token from the request header against the cookie.
     */
    verify(req: NextApiRequest) {
        // Skip for non-mutating requests
        if (['GET', 'HEAD', 'OPTIONS'].includes(req.method || '')) return

        const tokenFromHeader = req.headers['x-csrf-token']
        const tokenFromCookie = req.cookies[CSRF_COOKIE_NAME]

        if (!tokenFromCookie || !tokenFromHeader || tokenFromCookie !== tokenFromHeader) {
            throw new AppError('Invalid CSRF token', 403)
        }
    }
}
