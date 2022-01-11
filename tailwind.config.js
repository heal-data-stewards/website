const { colors } = require(`tailwindcss/defaultTheme`);
// console.log(colors.purple);
module.exports = {
  mode: "jit", // see https://tailwindcss.com/docs/just-in-time-mode
  purge: ["./components/**/*.js", "./pages/**/*.js"],
  darkMode: false, // or "media" or "class"
  variants: {
    fill: ['hover', 'focus'], // this line does the trick
  },
  theme: {
    extend: {
      colors: {
        primary: "#532565",
        purple: {
          light: "#c0b3c5",
          DEFAULT: "#532565",
          dark: "#532565",
        },
        magenta: {
          light2: "#e5e0e7",
          light: "#dabeca",
          DEFAULT: "#982568",
          dark: "",
        },
        red: {
          light: "#dbb9b3",
          DEFAULT: "#981f32",
          dark: "",
        },
        coral: {
          light: "#eecdcb",
          DEFAULT: "#bf362e",
          dark: "",
        },
        orange: {
          light: "f5d8c3",
          DEFAULT: "#e07c3e",
          dark: "",
        },
        gray: {
          light: "#dddddd",
          DEFAULT: "#818a91",
          dark: "#373a3c",
        },
        blue: {
          light: "",
          DEFAULT: "#0044B3",
          dark: "",
        },
      },
      container: {
        center: true,
        padding: {
          DEFAULT: "1rem",
          md: "2rem",
        },
      },
    },
    fontFamily: {
      sans: ["Montserrat", "sans-serif"],
    },
    screens: {
      sm: "640px",
      md: "768px",
      lg: "1024px",
      "large": {"min": "1051px"},
      xl: "1280px",
      'mdmax': {'max': '1050px'},
    },
  },
  variants: {
    extend: {},
  },
  plugins: [require("@tailwindcss/typography")],
};
