import React from "react"
import PropTypes from "prop-types"
import { buttonLinkPropTypes } from "utils/types"
import Loader from "./loader"
import Button from "@mui/material/Button"
import { createTheme, ThemeProvider } from "@mui/material"

const theme = createTheme({
  palette: {
    primary: {
      light: "#c0b3c5",
      main: "#532565",
      dark: "#982568",
      contrastText: "#fff",
    },
  },
})

export const Btn = ({
  button,
  appearance,
  compact = false,
  handleClick,
  loading = false,
  type,
}) => {
  return (
    <ThemeProvider theme={theme}>
      <Button
        link={button}
        onClick={() => handleClick()}
        type={type}
        variant="contained"
        color="primary"
      >
        {/* <div
        className={classNames(
          // Common classes
          "flex w-full justify-center lg:w-auto text-center uppercase tracking-wide font-semibold text-base md:text-sm border-2 rounded-md",
          // Full-size button
          {
            "px-8 py-4": compact === false,
          },
          // Compact button
          {
            "px-6 py-2": compact === true,
          },
          // Specific to when the button is fully dark
          {
            "bg-primary text-white border-primary": appearance === "dark",
          },
          // Specific to when the button is dark outlines
          {
            "text-primary border-primary": appearance === "dark-outline",
          },
          // Specific to when the button is fully white
          {
            "bg-white text-primary border-white": appearance === "white",
          },
          // Specific to when the button is white outlines
          {
            "text-white border-white": appearance === "white-outline",
          }
        )}
      > */}
        {loading && <Loader />}
        {button.text}
        {/* </div> */}
      </Button>
    </ThemeProvider>
  )
}

Btn.propTypes = {
  button: buttonLinkPropTypes,
  appearance: PropTypes.oneOf([
    "dark",
    "white-outline",
    "white",
    "dark-outline",
  ]),
  compact: PropTypes.bool,
}

export const Btn2 = ({
  button,
  appearance,
  compact = false,
  loading = false,
  type,
  href,
  height = "inherit",
}) => {
  return (
    <ThemeProvider theme={theme}>
      <Button
        href={href}
        link={button}
        type={type}
        variant="contained"
        color="primary"
        style={{ height: height }}
      >
        {/* <div
        className={classNames(
          // Common classes
          "flex w-full justify-center lg:w-auto text-center uppercase tracking-wide font-semibold text-base md:text-sm border-2 rounded-md",
          // Full-size button
          {
            "px-8 py-4": compact === false,
          },
          // Compact button
          {
            "px-6 py-2": compact === true,
          },
          // Specific to when the button is fully dark
          {
            "bg-primary text-white border-primary": appearance === "dark",
          },
          // Specific to when the button is dark outlines
          {
            "text-primary border-primary": appearance === "dark-outline",
          },
          // Specific to when the button is fully white
          {
            "bg-white text-primary border-white": appearance === "white",
          },
          // Specific to when the button is white outlines
          {
            "text-white border-white": appearance === "white-outline",
          }
        )}
      > */}
        {loading && <Loader />}
        {button.text}
        {/* </div> */}
      </Button>
    </ThemeProvider>
  )
}
