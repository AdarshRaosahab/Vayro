import { db } from './db'
import { serialize } from 'cookie'
import { NextApiResponse } from 'next'

const SESSION_COOKIE_NAME = 'vayro_session'
const MAX_AGE = 60 * 60 * 24 * 30 // 30 days

export async function createSession(userId: string) {
    const expiresAt = new Date(Date.now() + MAX_AGE * 1000)

    // Create session in DB
    const session = await db.session.create({
        data: {
            userId,
            expiresAt,
        },
    })

    return session
}

export async function getSession(sessionId: string) {
    // Check Mock Sessions first
    const MOCK_SESSIONS = (global as any)._MOCK_SESSIONS || {};
    if (MOCK_SESSIONS[sessionId]) {
        const sess = MOCK_SESSIONS[sessionId];
        if (sess.expires > new Date()) {
            return {
                id: sessionId,
                userId: sess.userId,
                expiresAt: sess.expires,
                user: {
                    id: sess.userId,
                    email: 'admin@vayro.in',
                    plan: 'premium',
                    role: 'ADMIN',
                    displayName: 'Admin User',
                    onboardCompleted: true,
                    website: null,
                    status: 'ACTIVE',
                    createdAt: new Date(),
                    password: '$2b$10$mockpasswordhash'
                }
            }
        }
    }

    try {
        const session = await db.session.findUnique({
            where: { id: sessionId },
            include: { user: true },
        })

        if (!session || session.expiresAt < new Date()) {
            return null
        }

        return session;
    } catch (e) {
        return null;
    }
}

export async function deleteSession(sessionId: string) {
    await db.session.delete({ where: { id: sessionId } }).catch(() => { })
}

export function setSessionCookie(res: NextApiResponse, sessionId: string) {
    const cookie = serialize(SESSION_COOKIE_NAME, sessionId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: MAX_AGE,
    })

    res.setHeader('Set-Cookie', cookie)
}

export function clearSessionCookie(res: NextApiResponse) {
    const cookie = serialize(SESSION_COOKIE_NAME, '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: -1,
    })

    res.setHeader('Set-Cookie', cookie)
}

export function getSessionIdFromRequest(req: any): string | null {
    const cookieHeader = req.headers.cookie
    if (!cookieHeader) return null

    const cookies: { [key: string]: string } = {}
    cookieHeader.split(';').forEach((cookie: string) => {
        const parts = cookie.split('=')
        if (parts.length === 2) cookies[parts[0].trim()] = parts[1].trim()
    })

    return cookies[SESSION_COOKIE_NAME] || null
}
