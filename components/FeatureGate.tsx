import { ReactNode } from 'react'
import LockOverlay from './LockOverlay'
import UpsellCard from './UpsellCard'

interface FeatureGateProps {
    requiresPremium?: boolean
    userPlan?: string
    children: ReactNode
    fallback?: 'overlay' | 'upsell' | 'hidden'
}

export default function FeatureGate({
    requiresPremium = false,
    userPlan = 'free',
    userRole = 'USER',
    children,
    fallback = 'overlay'
}: FeatureGateProps & { userRole?: string }) {
    const hasAccess = !requiresPremium || userPlan === 'premium' || userRole === 'ADMIN'

    if (hasAccess) {
        return <>{children}</>
    }

    if (fallback === 'hidden') {
        return null
    }

    if (fallback === 'upsell') {
        return <UpsellCard />
    }

    // Default to overlay
    return <LockOverlay isLocked={true}>{children}</LockOverlay>
}
