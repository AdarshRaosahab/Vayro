import { ButtonPrimary } from './ButtonPrimary'

interface QRDownloadButtonProps {
    code: string
    size?: number
    className?: string
    children?: React.ReactNode
    color?: string
    bg?: string
    style?: 'square' | 'dots' | 'rounded'
}

export default function QRDownloadButton({ code, size = 1024, className = '', children, color = '#0A1A2F', bg = '#FFFFF0', style = 'square' }: QRDownloadButtonProps) {
    const downloadUrl = `/api/qr/generate?code=${code}&size=${size}&download=1&color=${encodeURIComponent(color)}&bg=${encodeURIComponent(bg)}&style=${style}`

    return (
        <a href={downloadUrl} download className={`inline-block ${className}`}>
            <ButtonPrimary type="button" className="text-sm py-1 px-3">
                {children || 'Download SVG'}
            </ButtonPrimary>
        </a>
    )
}
