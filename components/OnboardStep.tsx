import { ReactNode } from 'react'
import { Card } from './Card'

interface OnboardStepProps {
    title: string
    subtitle?: string
    children: ReactNode
    className?: string
}

export default function OnboardStep({ title, subtitle, children, className = '' }: OnboardStepProps) {
    return (
        <div className={`w-full max-w-lg mx-auto animate-in slide-in-from-bottom-4 duration-500 ${className}`}>
            <div className="text-center mb-8">
                <h1 className="text-3xl font-heading font-bold text-deepNavy mb-2">{title}</h1>
                {subtitle && <p className="text-slateGray text-lg">{subtitle}</p>}
            </div>
            <Card className="p-8 shadow-xl border-t-4 border-gold">
                {children}
            </Card>
        </div>
    )
}
