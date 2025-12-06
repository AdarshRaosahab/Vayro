import { apiHandler } from '../../../lib/api-wrapper'
import { db } from '../../../lib/db'
import { getSession } from '../../../lib/sessions'
import { AuthError, AppError } from '../../../lib/errors'
import { GoogleSpreadsheet } from 'google-spreadsheet'
import { JWT } from 'google-auth-library'

// Helper to clean data for sheets
const clean = (val: any) => (val === null || val === undefined ? '' : String(val))

export default apiHandler(async (req, res) => {
    if (req.method !== 'POST') {
        throw new AppError('Method not allowed', 405)
    }

    // 1. Auth Check (Admin Only)
    const cookieHeader = req.headers.cookie
    if (!cookieHeader) throw new AuthError()
    const cookies: { [key: string]: string } = {}
    cookieHeader.split(';').forEach((cookie) => {
        const parts = cookie.split('=')
        if (parts.length === 2) cookies[parts[0].trim()] = parts[1].trim()
    })
    const sessionId = cookies['vayro_session']
    if (!sessionId) throw new AuthError()
    const session = await getSession(sessionId)
    if (!session || session.user.role !== 'ADMIN') throw new AuthError('Admin access required')

    // 2. Load Env Vars
    const sheetId = process.env.GOOGLE_SHEET_ID
    const serviceEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL
    const serviceKey = process.env.GOOGLE_SERVICE_ACCOUNT_KEY?.replace(/\\n/g, '\n')

    if (!sheetId || !serviceEmail || !serviceKey) {
        throw new AppError('Google Sheets configuration missing', 500)
    }

    // 3. Authenticate with Google
    const jwt = new JWT({
        email: serviceEmail,
        key: serviceKey,
        scopes: [
            'https://www.googleapis.com/auth/spreadsheets',
        ],
    })
    const doc = new GoogleSpreadsheet(sheetId, jwt)
    await doc.loadInfo()

    // 4. Sync Users
    let usersSheet = doc.sheetsByTitle['Users']
    if (!usersSheet) usersSheet = await doc.addSheet({ title: 'Users', headerValues: ['ID', 'Email', 'Name', 'Plan', 'Role', 'Status', 'Joined'] })

    // Fetch all users
    const users = await db.user.findMany({ orderBy: { createdAt: 'desc' } })
    const userRows = users.map(u => ({
        ID: u.id,
        Email: u.email,
        Name: u.displayName || '',
        Plan: u.plan,
        Role: u.role,
        Status: u.status,
        Joined: u.createdAt.toISOString()
    }))
    // Clear and Rewrite is simplest for sync, or we can just append checks.
    // For simplicity: Clear and Rewrite
    await usersSheet.clearRows()
    await usersSheet.addRows(userRows)

    // 5. Sync Reported Links
    let reportsSheet = doc.sheetsByTitle['Reports']
    if (!reportsSheet) reportsSheet = await doc.addSheet({ title: 'Reports', headerValues: ['Date', 'Reason', 'Link Code', 'Link Target', 'Reporter', 'Created By'] })

    const reports = await db.abuseReport.findMany({
        include: { link: { include: { user: true } }, user: true },
        orderBy: { createdAt: 'desc' }
    })
    const reportRows = reports.map(r => ({
        Date: r.createdAt.toISOString(),
        Reason: r.reason,
        'Link Code': r.link.code,
        'Link Target': r.link.target,
        Reporter: r.user?.email || 'Anonymous',
        'Created By': r.link.user?.email || 'Anonymous'
    }))
    await reportsSheet.clearRows()
    await reportsSheet.addRows(reportRows)

    // 6. Sync Active Customers (Premium)
    let customersSheet = doc.sheetsByTitle['Customers']
    if (!customersSheet) customersSheet = await doc.addSheet({ title: 'Customers', headerValues: ['Email', 'Since', 'Plan'] })

    const customers = users.filter(u => u.plan === 'premium')
    const customerRows = customers.map(u => ({
        Email: u.email,
        Since: u.createdAt.toISOString(),
        Plan: u.plan
    }))
    await customersSheet.clearRows()
    await customersSheet.addRows(customerRows)

    res.status(200).json({ ok: true, message: 'Synced to Google Sheets' })
})
