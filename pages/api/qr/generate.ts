import { apiHandler } from '../../../lib/api-wrapper'
import QRCode from 'qrcode'
import { AppError } from '../../../lib/errors'

export default apiHandler(async (req, res) => {
    if (req.method !== 'GET') {
        throw new AppError('Method not allowed', 405)
    }

    const { code, size = '512', download, color = '#0A1A2F', bg = '#FFFFF0', style = 'square' } = req.query

    if (!code || typeof code !== 'string') {
        throw new AppError('Missing code', 400)
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://vayro.in'
    const url = `${baseUrl}/${code}`
    const sizeInt = parseInt(size as string, 10) || 512

    // Validate hex colors
    const hexRegex = /^#[0-9A-Fa-f]{6}$/
    const darkColor = (typeof color === 'string' && hexRegex.test(color)) ? color : '#0A1A2F'
    const lightColor = (typeof bg === 'string' && hexRegex.test(bg)) ? bg : '#FFFFF0'

    // Generate QR Data
    const qrData = await QRCode.create(url, {
        errorCorrectionLevel: 'M'
    })

    const modules = qrData.modules
    const moduleCount = modules.size
    const cellSize = sizeInt / moduleCount

    // SVG Generation
    let pathData = ''

    for (let row = 0; row < moduleCount; row++) {
        for (let col = 0; col < moduleCount; col++) {
            if (modules.get(row, col)) {
                const x = col * cellSize
                const y = row * cellSize

                if (style === 'dots') {
                    // Circle for dots
                    const r = cellSize / 2
                    pathData += `<circle cx="${x + r}" cy="${y + r}" r="${r}" />`
                } else if (style === 'rounded') {
                    // Rounded rect
                    const r = cellSize * 0.35
                    pathData += `<rect x="${x}" y="${y}" width="${cellSize}" height="${cellSize}" rx="${r}" ry="${r}" />`
                } else {
                    // Default square
                    pathData += `<rect x="${x}" y="${y}" width="${cellSize}" height="${cellSize}" />`
                }
            }
        }
    }

    const svg = `<?xml version="1.0" standalone="yes"?>
<svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="${sizeInt}" height="${sizeInt}" viewBox="0 0 ${sizeInt} ${sizeInt}">
    <rect width="${sizeInt}" height="${sizeInt}" fill="${lightColor}"/>
    <g fill="${darkColor}">
        ${pathData}
    </g>
</svg>`

    res.setHeader('Content-Type', 'image/svg+xml')
    if (download === '1') {
        res.setHeader('Content-Disposition', `attachment; filename="vayro-qr-${code}.svg"`)
    } else {
        res.setHeader('Cache-Control', 'public, max-age=604800, immutable')
    }

    res.send(svg)
})
