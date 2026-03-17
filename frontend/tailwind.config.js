/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: "#06b6d4", // Cyan-500
                primaryLight: "#22d3ee", // Cyan-400
                primaryDark: "#0891b2", // Cyan-600
                secondary: "#14b8a6", // Teal-500
                secondaryLight: "#2dd4bf", // Teal-400
                secondaryDark: "#0f766e", // Teal-700
                accent: "#f43f5e", // Rose-500
                accentLight: "#fb7185", // Rose-400
                accentDark: "#e11c4a",
                background: "#f8fafc", // Slate-50
                backgroundDark: "#e2e8f0", // Slate-200
                backgroundLight: "#ffffff",
                card: "#ffffff",
                cardLight: "#f8fafc",
                cardDark: "#f1f5f9",
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
                'float-slow': {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-20px)' },
                },
                'pulse-slow': {
                    '0%, 100%': { opacity: '1' },
                    '50%': { opacity: '.5' },
                },
                'shimmer': {
                    '0%': { backgroundPosition: '-1000px 0' },
                    '100%': { backgroundPosition: '1000px 0' },
                },
                'aurora': {
                    from: { backgroundPosition: '50% 50%, 50% 50%' },
                    to: { backgroundPosition: '350% 50%, 350% 50%' },
                },
                'emoji-float': {
                    '0%': { transform: 'translateY(0) scale(0.5) rotate(-10deg)', opacity: '0' },
                    '20%': { transform: 'translateY(-20px) scale(1.2) rotate(10deg)', opacity: '1' },
                    '50%': { transform: 'translateY(-50px) scale(1) rotate(-5deg)', opacity: '0.8' },
                    '100%': { transform: 'translateY(-120px) scale(0.8) rotate(15deg)', opacity: '0' },
                },
                'emoji-pop': {
                    '0%': { transform: 'scale(0.5)', opacity: '0' },
                    '50%': { transform: 'scale(1.5)', opacity: '1' },
                    '100%': { transform: 'scale(1)', opacity: '1' },
                },
                'emoji-pop-center': {
                    '0%': { transform: 'scale(0) rotate(-15deg)', opacity: '0' },
                    '20%': { transform: 'scale(1.4) rotate(10deg)', opacity: '1' },
                    '40%': { transform: 'scale(1) rotate(-5deg)', opacity: '1' },
                    '80%': { transform: 'scale(1) rotate(0deg)', opacity: '1' },
                    '100%': { transform: 'scale(1.2)', opacity: '0' },
                }
            },
            animation: {
                'float': 'float 3s ease-in-out infinite',
                'float-slow': 'float-slow 6s ease-in-out infinite',
                'pulse-slow': 'pulse-slow 3s ease-in-out infinite',
                'shimmer': 'shimmer 2s infinite',
                'aurora': 'aurora 60s linear infinite',
                'emoji-float': 'emoji-float 3s ease-out forwards',
                'emoji-pop': 'emoji-pop 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
                'emoji-pop-center': 'emoji-pop-center 4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
            },
        },
    },
    plugins: [],
}
