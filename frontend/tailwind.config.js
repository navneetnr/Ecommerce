/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        surface: {
          bg: '#F7F8FA',
          sidebar: '#FFFFFF',
          card: '#FFFFFF',
          hover: '#F3F4F6',
          muted: '#F9FAFB',
        },
        brand: {
          50: '#EEF4FF',
          100: '#E0EBFF',
          500: '#315CBB',
          600: '#254898',
          700: '#1C3775',
        },
        content: {
          primary: '#171717',
          secondary: '#737373',
          tertiary: '#9CA3AF',
        },
        border: {
          subtle: '#E5E7EB',
          strong: '#D1D5DB',
        },
        status: {
          success: '#15803D',
          warning: '#D97706',
          error: '#DC2626',
          info: '#315CBB',
        }
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'subtle': '0 1px 2px 0 rgba(0, 0, 0, 0.04)',
        'card': '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.05)',
        'dropdown': '0 4px 6px -1px rgba(0, 0, 0, 0.08), 0 2px 4px -2px rgba(0, 0, 0, 0.06)',
      }
    },
  },
  plugins: [],
}
