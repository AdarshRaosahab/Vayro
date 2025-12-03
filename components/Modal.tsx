import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { Card } from './Card'

interface ModalProps {
    isOpen: boolean
    onClose: () => void
    title: string
    children: React.ReactNode
    maxWidth?: string
}

export const Modal = ({ isOpen, onClose, title, children, maxWidth = 'max-w-md' }: ModalProps) => {
    const modalRef = useRef<HTMLDivElement>(null)

    // Close on Escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose()
        }

        if (isOpen) {
            document.addEventListener('keydown', handleEscape)
            document.body.style.overflow = 'hidden' // Prevent scroll
        }

        return () => {
            document.removeEventListener('keydown', handleEscape)
            document.body.style.overflow = 'unset'
        }
    }, [isOpen, onClose])

    // Focus trap (simple version)
    useEffect(() => {
        if (isOpen && modalRef.current) {
            modalRef.current.focus()
        }
    }, [isOpen])

    if (!isOpen) return null

    // Portal to body to avoid z-index issues
    // Note: In Next.js with SSR, we might need to check if document is defined or use a portal component
    // For simplicity here, we'll render inline but fixed, or use a portal if possible.
    // Using inline fixed overlay for MVP simplicity.

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-navy-900/50 backdrop-blur-sm p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
        >
            <div
                className={`w-full ${maxWidth} animate-in fade-in zoom-in duration-200 focus:outline-none`}
                ref={modalRef}
                tabIndex={-1}
            >
                <Card className="relative overflow-hidden shadow-2xl">
                    <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-white">
                        <h2 id="modal-title" className="text-lg font-heading font-bold text-navy-900">
                            {title}
                        </h2>
                        <button
                            onClick={onClose}
                            className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-md hover:bg-slate-50"
                            aria-label="Close modal"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    <div className="p-6">
                        {children}
                    </div>
                </Card>
            </div>
        </div>
    )
}
