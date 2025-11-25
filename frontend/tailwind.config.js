/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          primary: '#0F62FE',
          secondary: '#008B94',
          accent: '#FFC857',
          muted: '#6B7A88',
        },
        neutral: {
          50: '#F7F9FC',
          100: '#EEF2F6',
          200: '#E2E8F0',
          300: '#CBD5E1',
          400: '#94A3B8',
          500: '#64748B',
          600: '#475569',
          700: '#334155',
          800: '#1E2A32',
          900: '#0F172A',
        },
        status: {
          success: '#138A36',
          warning: '#D9822B',
          danger: '#C01C28',
          info: '#2563EB',
        },
        surface: {
          base: '#FFFFFF',
          muted: '#F7F9FC',
          elevated: '#FAFBFF',
          border: '#E2E8F0',
        },
      },
      boxShadow: {
        card: '0 12px 30px rgba(15, 98, 254, 0.08)',
        subtle: '0 2px 12px rgba(14, 44, 66, 0.08)',
      },
      borderRadius: {
        xl: '1.25rem',
      },
      spacing: {
        18: '4.5rem',
        22: '5.5rem',
      },
    },
  },
  plugins: [],
}

