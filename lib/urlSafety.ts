import { ValidationError } from './errors'
import { blocklist } from './blocklist'

const PRIVATE_IP_RANGES = [
    /^127\./,
    /^10\./,
    /^172\.(1[6-9]|2[0-9]|3[0-1])\./,
    /^192\.168\./,
    /^0\./,
    /^169\.254\./
]

const UNSAFE_SCHEMES = ['javascript:', 'data:', 'vbscript:', 'file:']

export const urlSafety = {
    async isSafe(url: string): Promise<boolean> {
        try {
            const parsed = new URL(url)

            // 1. Check Scheme
            if (UNSAFE_SCHEMES.includes(parsed.protocol)) {
                throw new ValidationError('Unsafe URL scheme detected')
            }

            // 2. Check Hostname (Private IPs)
            const hostname = parsed.hostname
            if (hostname === 'localhost' || PRIVATE_IP_RANGES.some(regex => regex.test(hostname))) {
                throw new ValidationError('Redirects to private networks are not allowed')
            }

            // 3. Check Blocklist
            const isBlocked = await blocklist.isBlocked(hostname)
            if (isBlocked) {
                throw new ValidationError('Domain is on the blocklist')
            }

            return true
        } catch (err: any) {
            if (err instanceof ValidationError) throw err
            throw new ValidationError('Invalid URL format')
        }
    }
}
