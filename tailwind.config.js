/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                ivory: {
                    DEFAULT: 'var(--color-ivory-50)',
                    50: 'var(--color-ivory-50)',
                    100: 'var(--color-ivory-100)',
                    200: 'var(--color-ivory-200)',
                    300: 'var(--color-ivory-300)',
                },
                navy: {
                    50: 'var(--color-navy-50)',
                    100: 'var(--color-navy-100)',
                    500: 'var(--color-navy-500)',
                    700: 'var(--color-navy-700)',
                    800: 'var(--color-navy-800)',
                    900: 'var(--color-navy-900)',
                },
                gold: {
                    DEFAULT: 'var(--color-gold-500)',
                    100: 'var(--color-gold-100)',
                    300: 'var(--color-gold-300)',
                    400: 'var(--color-gold-400)',
                    500: 'var(--color-gold-500)',
                    600: 'var(--color-gold-600)',
                },
                slate: {
                    50: 'var(--color-slate-50)',
                    100: 'var(--color-slate-100)',
                    200: 'var(--color-slate-200)',
                    300: 'var(--color-slate-300)',
                    400: 'var(--color-slate-400)',
                    500: 'var(--color-slate-500)',
                    600: 'var(--color-slate-600)',
                    700: 'var(--color-slate-700)',
                    800: 'var(--color-slate-800)',
                    900: 'var(--color-slate-900)',
                },
                deepNavy: 'var(--color-navy-900)',
                slateGray: 'var(--color-slate-500)',
            },
            fontFamily: {
                sans: ['Open Sans', 'sans-serif'],
                heading: ['Montserrat', 'sans-serif'],
            },
            spacing: {
                'xs': 'var(--space-xs)',
                'sm': 'var(--space-sm)',
                'md': 'var(--space-md)',
                'lg': 'var(--space-lg)',
                'xl': 'var(--space-xl)',
                '2xl': 'var(--space-2xl)',
                '3xl': 'var(--space-3xl)',
            }
        },
    },
    plugins: [],
}
