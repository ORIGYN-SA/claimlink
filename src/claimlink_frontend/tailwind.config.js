/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        manrope: ["Manrope", "sans-serif"],
        quicksand: ["Quicksand", "sans-serif"],
      },
      fontSize: {
        "custom-14px": "14px",
      },
      lineHeight: {
        "custom-20px": "20px",
      },
    },
  },
  plugins: [],
};
