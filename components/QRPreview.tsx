import { useState } from 'react'

interface QRPreviewProps {
    code: string
    size?: number
    className?: string
    color?: string
    bg?: string
    style?: 'square' | 'dots' | 'rounded'
}

export default function QRPreview({ code, size = 256, className = '', color = '#0A1A2F', bg = '#FFFFF0', style = 'square' }: QRPreviewProps) {
    const [loading, setLoading] = useState(true)
    const src = `/api/qr/generate?code=${code}&size=${size}&color=${encodeURIComponent(color)}&bg=${encodeURIComponent(bg)}&style=${style}`

    return (
        <div className={`relative inline-block ${className}`}>
            {loading && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded animate-pulse">
                    <span className="text-xs text-gray-400">Loading...</span>
                </div>
            )}
            <img
                src={src}
                alt={`QR Code for ${code}`}
                width={size}
                height={size}
                className={`rounded-lg shadow-sm ${loading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
                onLoad={() => setLoading(false)}
            />
        </div>
    )
}
