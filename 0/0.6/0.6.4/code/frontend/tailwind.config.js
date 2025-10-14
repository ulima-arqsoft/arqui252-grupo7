/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: 'hsl(0 0% 100%)',
        foreground: 'hsl(222.2 84% 4.9%)',
        primary: '#2563eb',
        'primary-foreground': '#ffffff',
        secondary: '#f1f5f9',
        'secondary-foreground': '#0f172a',
        ring: '#3b82f6',
        input: '#e5e7eb',
        card: '#ffffff',
        'card-foreground': '#0f172a',
        accent: '#f3f4f6',
        'accent-foreground': '#111827',
        destructive: '#ef4444',
      }
    },
  },
  plugins: [],
}
