/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: "#6366f1",
                primaryLight: "#818cf8",
                primaryDark: "#4f46e5",
                secondary: "#a855f7",
                secondaryLight: "#c084fc",
                secondaryDark: "#9333ea",
                accent: "#f43f5e",
                accentLight: "#ff6b7a",
                accentDark: "#e11c4a",
                background: "#0f172a",
                backgroundDark: "#0a0f1f",
                backgroundLight: "#1a254f",
                card: "#1e293b",
                cardLight: "#334155",
                cardDark: "#0f172a",
                success: "#10b981",
                warning: "#f59e0b",
                error: "#ef4444",
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'Avenir', 'Helvetica', 'Arial', 'sans-serif'],
            },
            fontSize: {
                xs: ['0.75rem', { lineHeight: '1rem' }],
                sm: ['0.875rem', { lineHeight: '1.25rem' }],
                base: ['1rem', { lineHeight: '1.5rem' }],
                lg: ['1.125rem', { lineHeight: '1.75rem' }],
                xl: ['1.25rem', { lineHeight: '1.75rem' }],
                '2xl': ['1.5rem', { lineHeight: '2rem' }],
                '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
                '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
            },
            spacing: {
                '128': '32rem',
                '144': '36rem',
            },
            borderRadius: {
                'xl': '0.75rem',
                '2xl': '1rem',
                '3xl': '1.5rem',
            },
            boxShadow: {
                glow: '0 0 20px rgba(99, 102, 241, 0.3)',
                'glow-lg': '0 0 40px rgba(99, 102, 241, 0.4)',
                'glow-secondary': '0 0 20px rgba(168, 85, 247, 0.3)',
                'glow-accent': '0 0 20px rgba(244, 63, 94, 0.3)',
                'dark': '0 10px 30px rgba(0, 0, 0, 0.5)',
            },
            backdropBlur: {
                'xs': '2px',
            },
            keyframes: {
                'float': {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-10px)' },
                },
                'pulse-slow': {
                    '0%, 100%': { opacity: '1' },
                    '50%': { opacity: '.5' },
                },
                'shimmer': {
                    '0%': { backgroundPosition: '-1000px 0' },
                    '100%': { backgroundPosition: '1000px 0' },
                },
            },
            animation: {
                'float': 'float 3s ease-in-out infinite',
                'pulse-slow': 'pulse-slow 3s ease-in-out infinite',
                'shimmer': 'shimmer 2s infinite',
            },
        },
    },
    plugins: [],
}
