import React from 'react'

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string
    error?: string
}

export default function Textarea({ label, error, className = '', ...props }: TextareaProps) {
    return (
        <div className="w-full">
            {label && <label className="block text-sm font-medium text-slateGray mb-1">{label}</label>}
            <textarea
                className={`w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent outline-none transition-all duration-200 ${error ? 'border-red-500' : ''} ${className}`}
                {...props}
            />
            {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
        </div>
    )
}
