import { IncomingMessage } from 'http'
import { db } from './db'
import { getSession } from './sessions' // Assuming you have a getSession helper that works with cookies

export async function shouldShowAds(req: IncomingMessage): Promise<boolean> {
    try {
        // 1. Check if user is logged in
        // We need to parse cookies from the request
        const cookieHeader = req.headers.cookie
        if (!cookieHeader) return true // No cookies -> Guest -> Show Ads

        // Simple cookie parsing (or use a library if available in this context)
        const cookies: { [key: string]: string } = {}
        cookieHeader.split(';').forEach((cookie) => {
            const parts = cookie.split('=')
            if (parts.length === 2) {
                cookies[parts[0].trim()] = parts[1].trim()
            }
        })

        const sessionId = cookies['vayro_session']
        if (!sessionId) return true // No session -> Guest -> Show Ads

        // 2. Check session in DB
        const session = await getSession(sessionId)
        if (!session) return true // Invalid session -> Guest -> Show Ads

        // 3. Check user plan
        if (session.user.plan === 'premium') {
            return false // Premium -> No Ads
        }

        return true // Free -> Show Ads
    } catch (error) {
        console.error('Error checking ad status:', error)
        return true // Default to showing ads on error (safe fallback for revenue, though maybe annoying)
    }
}
