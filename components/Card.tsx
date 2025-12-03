import { HTMLAttributes } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
    noPadding?: boolean
}

export const Card = ({ children, className = '', noPadding = false, ...props }: CardProps) => {
    return (
        <div
            className={`
        bg-white rounded-xl shadow-sm border border-slate-100
        hover:shadow-md transition-shadow duration-300
        ${noPadding ? '' : 'p-6'}
        ${className}
      `}
            {...props}
        >
            {children}
        </div>
    )
}
