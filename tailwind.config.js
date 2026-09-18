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
        // Exact palette specified by design
        bg: "#FDFBF7",
        surface: "#FFFFFF",
        border: "#F0EBE3",
        "border-hover": "#E2D9CD",
        text: {
          primary: "#1F1B16",
          secondary: "#6B6258",
          muted: "#94897E",
        },
        primary: {
          DEFAULT: "#D97757",
          hover: "#C86646",
          light: "#FBF0EB",
          active: "#B85535",
        },
        sage: {
          DEFAULT: "#7C9885",
          hover: "#6A8773",
          light: "#EDF3EE",
        },
        success: {
          DEFAULT: "#5B8266",
          light: "#EAF2EC",
        },
        error: {
          DEFAULT: "#C1543D",
          light: "#FCEFEF",
        },
        whatsapp: "#25D366",
        viber: "#7360F2",
      },
      borderRadius: {
        none: "0px",
        sm: "4px",
        btn: "8px",
        input: "8px",
        DEFAULT: "8px",
        lg: "8px",
        xl: "12px",
        card: "12px",
        "2xl": "12px",
        full: "9999px",
      },
      boxShadow: {
        card: "0 1px 3px rgba(0, 0, 0, 0.06)",
        "card-hover": "0 6px 16px -2px rgba(31, 27, 22, 0.08), 0 2px 4px -2px rgba(31, 27, 22, 0.04)",
        nav: "0 1px 2px rgba(0, 0, 0, 0.03)",
        modal: "0 12px 32px -4px rgba(31, 27, 22, 0.12)",
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      fontSize: {
        xs: ['12px', { lineHeight: '16px' }],
        sm: ['13px', { lineHeight: '18px' }],
        base: ['15px', { lineHeight: '1.5' }],
        md: ['16px', { lineHeight: '1.4' }],
        lg: ['18px', { lineHeight: '1.3' }],
        xl: ['20px', { lineHeight: '1.25' }],
        '2xl': ['24px', { lineHeight: '1.2' }],
        '3xl': ['28px', { lineHeight: '1.2' }],
      },
    },
  },
  plugins: [],
};
