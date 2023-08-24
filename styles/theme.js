import { createTheme } from '@mui/material/styles';

const palette = {
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
    fontSize: '2.25rem',
    fontWeight: '600',
    paddingBottom: '1.5rem',
    lineHeight: 1.2,
  },
  h2: {
    fontSize: '1.5rem',
    lineHeight: '1.4',
    fontWeight: '400',
    letterSpacing: '.1px',
    paddingBottom: '1rem',
  },
  h3: {
    fontSize: '1.2rem',
    fontWeight: '700',
    paddingBottom: '0.5rem',
    lineHeight: "1.7rem"
  },
  h4: {
    fontSize: '0.9rem'
  },
  h6: {
    fontSize: '1rem',
  },
  body1: {
    lineHeight: 1.5,
    fontSize: '1.25rem',
  },
  body2: {
    lineHeight: 1.35,
    fontSize: '1.15rem',
  },
  subtitle1: {
    color: "#441d4f",
    fontWeight: "600",
    lineHeight: "30.2px",
    fontSize: "1.26rem",
  },
  subtitle2: {
    fontWeight: "700",
    letterSpacing: "0.025em",
    textTransform: "uppercase",
    color: palette.magenta.DEFAULT,
    fontSize: "1rem",
    marginBottom: "1rem",
  }
}

export const theme = createTheme({
  typography
})