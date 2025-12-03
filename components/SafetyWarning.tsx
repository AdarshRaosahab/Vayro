import { useState, useEffect } from 'react'
import { ButtonPrimary } from './ButtonPrimary'

export default function SafetyWarning() {
    const [isOpen, setIsOpen] = useState(false)

    useEffect(() => {
        // Show popup on mount
        setIsOpen(true)
    }, [])

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border border-slate-100 relative overflow-hidden animate-in zoom-in-95 duration-200">
                {/* Decorative background element */}
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-gold-400 to-gold-600" />

                <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-gold-50 rounded-full flex items-center justify-center mb-4">
                        <svg className="w-8 h-8 text-gold-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>

                    <h3 className="text-xl font-heading font-bold text-deepNavy mb-2">
                        Safety Caution
                    </h3>

                    <p className="text-slate-600 mb-6 text-sm leading-relaxed">
                        Do not open this link if you received it from an unknown source. Vayro is a public tool, and we want to ensure you stay safe from potential fraud.
                    </p>

                    <ButtonPrimary
                        onClick={() => setIsOpen(false)}
                        className="w-full justify-center"
                    >
                        I Understand, Continue
                    </ButtonPrimary>

                    <p className="text-xs text-slate-400 mt-4">
                        This is a safety message from Vayro.
                    </p>
                </div>
            </div>
        </div>
    )
}
