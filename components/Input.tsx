import { InputHTMLAttributes, forwardRef } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string
    error?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, className = '', ...props }, ref) => {
        return (
            <div className="w-full">
                {label && (
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        {label}
                    </label>
                )}
                <input
                    ref={ref}
                    className={`
            w-full px-4 py-2 rounded-md border bg-white
            text-slate-900 placeholder-slate-400
            focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500
            disabled:bg-slate-50 disabled:text-slate-500
            transition-all duration-200
            ${error ? 'border-red-300 focus:ring-red-200 focus:border-red-500' : 'border-slate-300'}
            ${className}
          `}
                    {...props}
                />
                {error && (
                    <p className="mt-1 text-sm text-red-600" role="alert">
                        {error}
                    </p>
                )}
            </div>
        )
    }
)

Input.displayName = 'Input'
