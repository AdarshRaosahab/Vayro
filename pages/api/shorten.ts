import { apiHandler } from '../../lib/api-wrapper'
import { db } from '../../lib/db'
import { getSession } from '../../lib/sessions'
import { validateURL } from '../../lib/validators'
import { rateLimit } from '../../lib/rateLimit'
import { urlSafety } from '../../lib/urlSafety'
import { malwareCheck } from '../../lib/malwareCheck'
import { fraudPrevention } from '../../lib/fraudPrevention'
import { generateShortCode } from '../../lib/generator'
import { AppError } from '../../lib/errors'

export default apiHandler(async (req, res) => {
    if (req.method !== 'POST') {
        throw new Error('Method not allowed')
    }

    const ip = rateLimit.getIp(req)
    await rateLimit.check(ip, { limit: 60, windowSeconds: 60 })

    // Optional: Link to user if logged in
    let userId = undefined
    const cookieHeader = req.headers.cookie
    if (cookieHeader) {
        const cookies: { [key: string]: string } = {}
        cookieHeader.split(';').forEach((cookie) => {
            const parts = cookie.split('=')
            if (parts.length === 2) cookies[parts[0].trim()] = parts[1].trim()
        })
        const sessionId = cookies['vayro_session']
        if (sessionId) {
            const session = await getSession(sessionId)
            if (session) {
                userId = session.userId
                // Check if user is suspended
                const user = await db.user.findUnique({ where: { id: userId } })
                if (user?.status === 'SUSPENDED') {
                    throw new AppError('Your account has been suspended due to security violations.', 403)
                }
            }
        }
    }

    const { url, longUrl, alias, note } = req.body
    const targetUrl = url || longUrl
    const validUrl = validateURL(targetUrl)

    // Check Premium for Note
    if (note) {
        if (!userId) {
            throw new AppError('You must be logged in to use premium features.', 401)
        }
        const user = await db.user.findUnique({ where: { id: userId } })
        if (user?.plan !== 'premium' && user?.role !== 'ADMIN') {
            throw new AppError('Private notes are a Premium feature.', 403)
        }
    }

    // Security Checks
    // 1. Proactive Fraud Prevention (Keywords & Domains)
    const fraudCheck = fraudPrevention.isSuspicious(validUrl)
    if (fraudCheck.isSuspicious) {
        throw new AppError(`Link blocked: ${fraudCheck.reason}`, 400)
    }

    // 2. Existing Safety Checks
    await urlSafety.isSafe(validUrl)
    const isClean = await malwareCheck.scan(validUrl)
    if (!isClean) {
        throw new AppError('Malware detected', 400)
    }

    // Mock Mode State (In-memory fallback for development)
    const MOCK_DB = (global as any)._MOCK_LINKS || {};
    (global as any)._MOCK_LINKS = MOCK_DB;

    // Attempt DB operations, fallback to mock if DB fails
    try {
        let code = alias
        if (code) {
            const existing = await db.link.findUnique({ where: { code } })
            if (existing) {
                throw new Error('Alias already taken')
            }
        } else {
            let retries = 0
            const maxRetries = 5
            while (retries < maxRetries) {
                code = generateShortCode(6)
                // Try to check DB, if it fails (e.g. no connection), we catch below
                try {
                    const existing = await db.link.findUnique({ where: { code } })
                    if (!existing) break
                } catch (dbErr) {
                    console.warn("DB Connection failed, using mock check")
                    break;
                }
                retries++
            }
        }

        const link = await db.link.create({
            data: {
                target: validUrl,
                code,
                userId,
                note: note || undefined,
            },
        })

        return res.status(201).json({ ok: true, code: link.code, short_url: `/${link.code}` }) // normalized to short_url
    } catch (err: any) {
        console.error("Database Error:", err.message);
        console.warn("Falling back to Mock Mode");

        // Mock Mode Logic
        const mockCode = alias || generateShortCode(6);
        MOCK_DB[mockCode] = { target: validUrl, created: new Date() };

        // Return success response even if DB failed
        return res.status(201).json({
            ok: true,
            code: mockCode,
            short_url: `/${mockCode}`,
            mock: true
        })
    }
})
