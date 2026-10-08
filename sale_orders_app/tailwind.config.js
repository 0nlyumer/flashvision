/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "primary": "var(--color-primary, #2962ff)",
        "on-primary": "var(--color-on-primary, #ffffff)",
        "primary-container": "var(--color-primary-container, rgba(41, 98, 255, 0.15))",
        "on-primary-container": "var(--color-on-primary-container, #2962ff)",

        "background": "var(--color-background, #f8fafc)",
        "on-background": "var(--color-on-background, #0f172a)",

        "surface": "var(--color-surface, #ffffff)",
        "on-surface": "var(--color-on-surface, #0f172a)",
        "on-surface-variant": "var(--color-on-surface-variant, #64748b)",

        "surface-container-lowest": "var(--color-surface-container-lowest, #ffffff)",
        "surface-container-low": "var(--color-surface-container-low, #f8fafc)",
        "surface-container": "var(--color-surface-container, #f1f5f9)",
        "surface-container-high": "var(--color-surface-container-high, #e2e8f0)",
        "surface-container-highest": "var(--color-surface-container-highest, #cbd5e1)",
        "surface-dim": "var(--color-surface-container-low, #f1f5f9)",
        "surface-bright": "var(--color-surface, #ffffff)",
        "surface-variant": "var(--color-surface-container, #f1f5f9)",

        "outline": "var(--color-outline, #cbd5e1)",
        "outline-variant": "var(--color-outline-variant, #e2e8f0)",

        "secondary": "var(--color-secondary, #475569)",
        "on-secondary": "#ffffff",
        "secondary-container": "var(--color-secondary-container, #e2e8f0)",
        "on-secondary-container": "var(--color-on-secondary-container, #1e293b)",

        "error": "#ef4444",
        "on-error": "#ffffff",
        "error-container": "#fee2e2",
        "on-error-container": "#991b1b",

        "tertiary": "#089981",
        "on-tertiary": "#ffffff",
        "tertiary-container": "#d1fae5",
        "on-tertiary-container": "#065f46"
      },
      fontFamily: {
        "headline": ["var(--font-headline, Manrope)", "sans-serif"],
        "body": ["var(--font-body, Inter)", "sans-serif"],
        "label": ["var(--font-body, Inter)", "sans-serif"]
      },
      borderRadius: {
        "DEFAULT": "var(--radius-default, 0.25rem)",
        "lg": "var(--radius-lg, 0.5rem)",
        "xl": "var(--radius-xl, 0.75rem)",
        "full": "var(--radius-full, 9999px)",
        "2xl": "var(--radius-2xl, 1rem)",
        "3xl": "var(--radius-3xl, 1.5rem)"
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/container-queries'),
  ],
}
