import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'union': ['Union Helvetica', 'Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
        'space': ['Space Grotesk', 'system-ui', 'sans-serif'],
        'mono': ['JetBrains Mono', 'monospace'],
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        'glass-white': "var(--glass-white)",
        'glass-white-strong': "var(--glass-white-strong)",
      },
      backdropBlur: {
        'brutal': '12px',
        'brutal-strong': '16px',
      },
      borderWidth: {
        'brutal': '2px',
        'brutal-thick': '4px',
      },
      boxShadow: {
        'brutal': 'var(--shadow-brutal)',
        'brutal-hover': '0 12px 40px rgba(0, 0, 0, 0.2)',
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '26': '6.5rem',
        '30': '7.5rem',
      },
      animation: {
        'slide-in': 'slideInBrutal 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
      },
    },
  },
  plugins: [],
} satisfies Config; 