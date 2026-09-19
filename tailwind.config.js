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
        // High-trust marketplace palette inspired by Housing.com & adapted for Nepal
        bg: "#FFFFFF",
        "bg-subtle": "#F8FAFC",
        surface: "#FFFFFF",
        border: "#E2E8F0",
        "border-hover": "#CBD5E1",
        text: {
          primary: "#0F172A", // Deep Slate 900
          secondary: "#475569", // Neutral Slate 600
          muted: "#94A3B8", // Slate 400
        },
        primary: {
          DEFAULT: "#1E40AF", // Himalayan Royal Indigo (Single Bold Accent like Housing.com's purple)
          hover: "#1D4ED8",
          light: "#EFF6FF", // Soft ice-blue tint
          active: "#1E3A8A",
          dark: "#172554",
        },
        brand: {
          DEFAULT: "#1E40AF",
          hover: "#1D4ED8",
          light: "#EFF6FF",
          border: "#DBEAFE",
        },
        success: {
          DEFAULT: "#059669", // Emerald 600 (Verified landlord trust)
          light: "#ECFDF5",
        },
        error: {
          DEFAULT: "#EF4444",
          light: "#FEF2F2",
        },
        whatsapp: "#25D366",
        viber: "#7360F2",
      },
      borderRadius: {
        none: "0px",
        sm: "6px",
        btn: "10px",
        input: "10px",
        DEFAULT: "10px",
        lg: "12px",
        xl: "14px",
        card: "16px",
        "2xl": "16px",
        "3xl": "24px",
        full: "9999px",
      },
      boxShadow: {
        card: "0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.04)",
        "card-hover": "0 12px 28px -4px rgba(15, 23, 42, 0.08), 0 4px 8px -2px rgba(15, 23, 42, 0.03)",
        nav: "0 1px 3px 0 rgba(0, 0, 0, 0.05)",
        modal: "0 25px 50px -12px rgba(15, 23, 42, 0.2)",
        floating: "0 16px 36px -6px rgba(15, 23, 42, 0.09), 0 4px 12px -2px rgba(15, 23, 42, 0.03)",
        glow: "0 0 24px rgba(30, 64, 175, 0.25)",
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'Noto Sans Devanagari', 'system-ui', '-apple-system', 'sans-serif'],
      },
      fontSize: {
        xs: ['12px', { lineHeight: '16px' }],
        sm: ['13px', { lineHeight: '18px' }],
        base: ['15px', { lineHeight: '1.5' }],
        md: ['16px', { lineHeight: '1.4' }],
        lg: ['18px', { lineHeight: '1.3' }],
        xl: ['20px', { lineHeight: '1.25' }],
        '2xl': ['24px', { lineHeight: '1.2' }],
        '3xl': ['30px', { lineHeight: '1.2' }],
        '4xl': ['38px', { lineHeight: '1.15' }],
      },
    },
  },
  plugins: [],
};
