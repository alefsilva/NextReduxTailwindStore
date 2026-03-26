import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/presentation/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // ─── Color Tokens ─────────────────────────────────────────────────────
      colors: {
        brand: {
          50:  '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6', // primary
          600: '#2563eb', // primary-dark
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        neutral: {
          50:  '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
        },
        success: {
          light:   '#d1fae5',
          DEFAULT: '#10b981',
          dark:    '#065f46',
        },
        warning: {
          light:   '#fef3c7',
          DEFAULT: '#f59e0b',
          dark:    '#92400e',
        },
        error: {
          light:   '#fee2e2',
          DEFAULT: '#ef4444',
          dark:    '#991b1b',
        },
      },

      // ─── Spacing Tokens ────────────────────────────────────────────────────
      spacing: {
        '4.5': '1.125rem',
        '13':  '3.25rem',
        '15':  '3.75rem',
        '18':  '4.5rem',
        '22':  '5.5rem',
        '30':  '7.5rem',
      },

      // ─── Typography Tokens ─────────────────────────────────────────────────
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        'display-lg': ['3.75rem', { lineHeight: '1',    fontWeight: '700' }],
        'display-md': ['3rem',    { lineHeight: '1.1',  fontWeight: '700' }],
        'display-sm': ['2.25rem', { lineHeight: '1.2',  fontWeight: '600' }],
        'heading-lg': ['1.875rem',{ lineHeight: '1.3',  fontWeight: '600' }],
        'heading-md': ['1.5rem',  { lineHeight: '1.4',  fontWeight: '600' }],
        'heading-sm': ['1.25rem', { lineHeight: '1.5',  fontWeight: '500' }],
        'body-lg':    ['1.125rem',{ lineHeight: '1.75'               }],
        'body-md':    ['1rem',    { lineHeight: '1.625'              }],
        'body-sm':    ['0.875rem',{ lineHeight: '1.5'                }],
        'caption':    ['0.75rem', { lineHeight: '1.4'                }],
      },

      // ─── Border Radius Tokens ──────────────────────────────────────────────
      borderRadius: {
        xs:   '0.125rem',
        sm:   '0.25rem',
        md:   '0.375rem',
        lg:   '0.5rem',
        xl:   '0.75rem',
        '2xl':'1rem',
        '3xl':'1.5rem',
      },

      // ─── Shadow Tokens ─────────────────────────────────────────────────────
      boxShadow: {
        'card':       '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        'card-hover': '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
        'modal':      '0 25px 50px -12px rgb(0 0 0 / 0.25)',
        'focus':      '0 0 0 3px rgb(59 130 246 / 0.5)',
      },

      // ─── Transition Tokens ─────────────────────────────────────────────────
      transitionDuration: {
        fast:   '100ms',
        normal: '200ms',
        slow:   '300ms',
      },
    },
  },
  plugins: [],
};

export default config;
