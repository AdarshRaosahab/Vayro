import { useEffect, useState } from 'react'

interface AdSlotProps {
    slotId: string
    responsive?: boolean
    className?: string
    style?: React.CSSProperties
}

export default function AdSlot({ slotId, responsive = true, className = '', style }: AdSlotProps) {
    const [mounted, setMounted] = useState(false)
    const [showAds, setShowAds] = useState<boolean | null>(null)
    const clientId = "ca-pub-6145288296775657"

    useEffect(() => {
        setMounted(true)
        // Check if we should show ads
        fetch('/api/ads/can-show')
            .then((res) => res.json())
            .then((data) => {
                setShowAds(data.showAds)
            })
            .catch(() => setShowAds(true)) // Default to true on error
    }, [])

    useEffect(() => {
        if (mounted && showAds && clientId) {
            try {
                // @ts-ignore
                (window.adsbygoogle = window.adsbygoogle || []).push({})
            } catch (err) {
                console.error('AdSense error:', err)
            }
        }
    }, [mounted, showAds, clientId])

    // Prevent hydration mismatch by returning null on server
    if (!mounted) return null
    if (showAds === false) return null // Premium user
    if (!clientId) return null // No client ID configured

    return (
        <div className={`ad-container ${className}`} style={style}>
            <ins
                className="adsbygoogle"
                style={{ display: 'block' }}
                data-ad-client={clientId}
                data-ad-slot={slotId}
                data-ad-format={responsive ? 'auto' : undefined}
                data-full-width-responsive={responsive ? 'true' : undefined}
            />
        </div>
    )
}
