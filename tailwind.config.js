/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx,html}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Refined modern palette: single primary accent + neutral slate scale
        primary: {
          DEFAULT: "#E76F51",
          hover: "#D65D3F",
          light: "#FFF5F2",
          dark: "#C34A2C",
        },
        // Secondary accent for trust/location tags
        secondary: {
          DEFAULT: "#0F4C5C",
          hover: "#09333E",
          light: "#F0F7F9",
        },
        // Specific chat app tokens
        whatsapp: "#25D366",
        viber: "#7360F2",
        // Semantic surfaces & neutrals
        surface: "#F8FAFC",
        "surface-card": "#FFFFFF",
        "surface-subtle": "#F1F5F9",
        "surface-muted": "#E2E8F0",
        "on-surface": "#0F172A",
        "on-surface-variant": "#475569",
        "on-primary": "#FFFFFF",
        // Backward compatibility mappings
        "primary-container": "#FFF5F2",
        "secondary-container": "#F0F7F9",
        "on-secondary-container": "#0F4C5C",
        "surface-container-lowest": "#FFFFFF",
        "surface-container-low": "#F8FAFC",
        "surface-container": "#F1F5F9",
        "surface-container-high": "#E2E8F0",
        "surface-container-highest": "#CBD5E1",
        "error-container": "#FEE2E2",
        error: "#DC2626",
      },
      borderRadius: {
        none: "0px",
        sm: "0.25rem", // 4px
        DEFAULT: "0.5rem", // 8px
        md: "0.5rem", // 8px
        lg: "0.625rem", // 10px
        xl: "0.75rem", // 12px
        "2xl": "1rem", // 16px
        full: "9999px",
      },
      boxShadow: {
        xs: "0 1px 2px 0 rgba(15, 23, 42, 0.04)",
        sm: "0 1px 3px 0 rgba(15, 23, 42, 0.06), 0 1px 2px -1px rgba(15, 23, 42, 0.04)",
        md: "0 4px 12px -2px rgba(15, 23, 42, 0.08), 0 2px 6px -2px rgba(15, 23, 42, 0.04)",
        lg: "0 10px 24px -4px rgba(15, 23, 42, 0.1), 0 4px 8px -2px rgba(15, 23, 42, 0.04)",
        nav: "0 1px 4px 0 rgba(15, 23, 42, 0.05)",
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        heading: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      fontSize: {
        '2xs': ['11px', { lineHeight: '15px' }],
        xs: ['12px', { lineHeight: '16px' }],
        sm: ['13px', { lineHeight: '19px' }],
        base: ['14px', { lineHeight: '21px' }],
        md: ['15px', { lineHeight: '22px' }],
        lg: ['16px', { lineHeight: '24px' }],
        xl: ['18px', { lineHeight: '26px' }],
        '2xl': ['22px', { lineHeight: '28px' }],
        '3xl': ['26px', { lineHeight: '32px' }],
        '4xl': ['30px', { lineHeight: '36px' }],
      },
      animation: {
        shimmer: "shimmer 1.5s infinite linear",
        "fade-in": "fadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "slide-up": "slideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards",
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};
