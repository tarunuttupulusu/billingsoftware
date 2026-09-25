/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#FAFAF8',
        surface: '#FFFFFF',
        surfaceMuted: '#F7F7F5',
        surfaceElevated: '#F7F7F5',
        border: '#E8E6E4',
        borderLight: '#F0EFED',
        primary: {
          DEFAULT: '#EA580C',
          hover: '#C2410C',
          light: '#FFF7ED',
          soft: '#FFEDD5',
        },
        heading: '#1C1917',
        main: '#2D2D2D',
        secondary: '#565656',
        muted: '#78716C',
        placeholder: '#A8A29E',
        success: {
          DEFAULT: '#059669',
          bg: '#ECFDF5',
        },
        info: {
          DEFAULT: '#2563EB',
          bg: '#EFF6FF',
        },
        warning: {
          DEFAULT: '#D97706',
          bg: '#FFFBEB',
        },
        danger: {
          DEFAULT: '#DC2626',
          bg: '#FEF2F2',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
      boxShadow: {
        sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
        card: '0 1px 3px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.03)',
        soft: '0 1px 3px rgba(0, 0, 0, 0.06)',
        button: '0 4px 12px rgba(234, 88, 12, 0.20)',
        dropdown: '0 4px 20px -2px rgba(28, 25, 23, 0.08), 0 2px 6px -1px rgba(28, 25, 23, 0.04)',
      },
      borderRadius: {
        DEFAULT: '8px',
        input: '14px',
        card: '16px',
        container: '20px',
        button: '14px',
      },
    },
  },
  plugins: [],
};
