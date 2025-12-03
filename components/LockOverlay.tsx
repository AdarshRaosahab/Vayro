import { ReactNode } from 'react'

interface LockOverlayProps {
    isLocked: boolean
    children: ReactNode
}

export default function LockOverlay({ isLocked, children }: LockOverlayProps) {
    if (!isLocked) return <>{children}</>

    return (
        <div className="relative group">
            <div className="blur-sm select-none pointer-events-none opacity-50 transition-all duration-300">
                {children}
            </div>
            <div className="absolute inset-0 flex flex-col items-center justify-center z-10 bg-white/10 backdrop-blur-[1px] rounded-lg border-2 border-dashed border-slate-300">
                <div className="bg-white p-3 rounded-full shadow-lg mb-2">
                    <svg className="w-6 h-6 text-slateGray" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                </div>
                <span className="text-sm font-semibold text-deepNavy bg-white/80 px-3 py-1 rounded-full">
                    Premium Feature
                </span>
            </div>
        </div>
    )
}
