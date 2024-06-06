import { createTheme } from '@mui/material/styles';

const palette = {
  primary: {
    main: "#532565",
    light: "#c0b3c5",
    dark: "#532565",
    contrastText: "#fff",
  },
  magenta: {
    light2: "#e5e0e7",
    light: "#EFBDDA",
    DEFAULT: "#982568",
    dark: "",
    new: "#8b5b92",
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
}

const typography = {
  fontFamily: "Montserrat",
  h1: {
    fontSize: '3rem',
    fontWeight: '600',
    paddingBottom: '1rem',
    lineHeight: 1,
    color: palette.primary.main
  },
  h2: {
    fontSize: '2rem',
    lineHeight: '1.25',
    fontWeight: '500',
    paddingBottom: '1rem',
  },
  h3: {
    fontSize: '1.25rem',
    fontWeight: '600',
    paddingBottom: '0.5rem',
    lineHeight: 1.35,
    color: palette.primary.main
  },
  h4: {
    fontSize: '1.15rem',
    fontWeight: '700',
    paddingBottom: '0.5rem',
    lineHeight: 1.35,
  },
  h6: {
    fontSize: '1rem',
  },
  body1: {
    lineHeight: 1.45,
    fontSize: '1.1rem',
    marginBottom: '0.5rem',
  },
  body2: {
    lineHeight: 1.35,
    fontSize: '1.15rem',
  },
  subtitle1: {
    color: palette.primary.main,
    fontWeight: "600",
    lineHeight: "30.2px",
    fontSize: "1.15rem",
  },
  subtitle2: {
    fontWeight: 700,
    letterSpacing: "0.025em",
    textTransform: "uppercase",
    color: palette.magenta.DEFAULT,
    fontSize: "1rem",
    marginBottom: "1rem",
  }
}

export const theme = createTheme({
  palette,
  typography
})