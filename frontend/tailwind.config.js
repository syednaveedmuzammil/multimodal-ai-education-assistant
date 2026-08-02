/** @type {import('tailwindcss').Config} */

export default {

  content: [
    "./index.html",
    "./src/**/*.{js,jsx}"
  ],

  theme: {

    extend: {

      colors: {

        primary: "#7C3AED",

        secondary: "#8B5CF6",

        accent: "#3B82F6",

        background: "#0F172A",

        sidebar: "#111827",

        card: "#1E293B",

        border: "#334155",

        success: "#22C55E",

        warning: "#F59E0B",

        danger: "#EF4444",

        muted: "#94A3B8"
      },

      borderRadius: {

        xl: "1rem",

        "2xl": "1.25rem",

        "3xl": "1.5rem"
      },

      fontFamily: {

        sans: ["Poppins", "sans-serif"]
      },

      boxShadow: {

        card: "0 10px 30px rgba(0,0,0,.25)",

        glow: "0 0 25px rgba(124,58,237,.45)"
      },

      transitionTimingFunction: {

        smooth: "cubic-bezier(0.4,0,0.2,1)"
      }
    }
  },

  plugins: []
};