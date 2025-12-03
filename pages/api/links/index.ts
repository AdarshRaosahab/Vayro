import type { NextApiRequest, NextApiResponse } from 'next'

type Link = {
    id: string
    code: string
    target: string
    clicks: number
    createdAt: string
}

type Data = {
    ok: boolean
    links?: Link[]
    link?: Link
    error?: string
}

const MOCK_LINKS: Link[] = [
    { id: '1', code: 'launch', target: 'https://example.com/launch', clicks: 1250, createdAt: '2023-10-01' },
    { id: '2', code: 'promo', target: 'https://example.com/promo', clicks: 850, createdAt: '2023-10-05' },
    { id: '3', code: 'social', target: 'https://twitter.com/vayro', clicks: 300, createdAt: '2023-10-10' },
]

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    if (req.method === 'GET') {
        return res.status(200).json({ ok: true, links: MOCK_LINKS })
    }

    if (req.method === 'POST') {
        const { target, customAlias } = req.body
        const newLink: Link = {
            id: Math.random().toString(36).substring(7),
            code: customAlias || Math.random().toString(36).substring(7),
            target,
            clicks: 0,
            createdAt: new Date().toISOString(),
        }
        return res.status(201).json({ ok: true, link: newLink })
    }

    res.status(405).json({ ok: false, error: 'Method not allowed' })
}
