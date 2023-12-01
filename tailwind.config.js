/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  daisyui: {
    themes: [
      {
        light: {
          primary: "#f8fafc",
          secondary: "#ebebeb",
          accent: "#face5e",
          text: "#2B3139",
        },
      },
      {
        dark: {
          primary: "#33363c",
          secondary: "#5C626C",
          accent: "#face5e",
          text: "#f8fafc",
        },
      },
    ],
  },
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter var", ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [
    require("daisyui"),
    require("@tailwindcss/aspect-ratio"),
    require("@tailwindcss/forms"),
  ],
};
