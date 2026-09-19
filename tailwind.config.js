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
        // Modern crisp Airbnb & Linear inspired palette
        bg: "#F8FAFC",
        surface: "#FFFFFF",
        border: "#E2E8F0",
        "border-hover": "#CBD5E1",
        text: {
          primary: "#0F172A",
          secondary: "#475569",
          muted: "#94A3B8",
        },
        primary: {
          DEFAULT: "#F04D36", // High-conversion vibrant coral
          hover: "#DF3922",
          light: "#FEF2F0",
          active: "#C82B15",
        },
        sage: {
          DEFAULT: "#0D9488",
          hover: "#0F766E",
          light: "#F0FDFA",
        },
        success: {
          DEFAULT: "#10B981",
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
        nav: "0 1px 2px 0 rgba(0, 0, 0, 0.03)",
        modal: "0 20px 40px -10px rgba(15, 23, 42, 0.16)",
        floating: "0 14px 34px -6px rgba(15, 23, 42, 0.1), 0 4px 10px -2px rgba(15, 23, 42, 0.04)",
        glow: "0 0 24px rgba(240, 77, 54, 0.28)",
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
        '4xl': ['36px', { lineHeight: '1.15' }],
      },
    },
  },
  plugins: [],
};
