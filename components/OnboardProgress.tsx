interface OnboardProgressProps {
    currentStep: number
    totalSteps: number
}

export default function OnboardProgress({ currentStep, totalSteps }: OnboardProgressProps) {
    return (
        <div className="flex justify-center items-center space-x-2 mb-8">
            {Array.from({ length: totalSteps }).map((_, i) => (
                <div
                    key={i}
                    className={`h-2 rounded-full transition-all duration-300 ${i + 1 === currentStep ? 'w-8 bg-gold' : 'w-2 bg-slate-200'
                        } ${i + 1 < currentStep ? 'bg-deepNavy' : ''}`}
                />
            ))}
        </div>
    )
}
