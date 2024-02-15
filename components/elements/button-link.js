import PropTypes from "prop-types"
import { buttonLinkPropTypes } from "utils/types"
import CustomLink from "./custom-link"
import { createTheme, ThemeProvider } from "@mui/material"

const theme = createTheme({
  palette: {
    primary: {
      light: "#c0b3c5",
      main: "#532565",
      dark: "#532565",
      contrastText: "#fff",
    },
  },
})

const ButtonContent = ({ button, appearance, compact }) => {
  return <div>{button.text}</div>
}

const ButtonLink = ({ button, appearance, compact = false }) => {
  return (
    <ThemeProvider theme={theme}>
      <CustomLink link={button}>
        <ButtonContent
          button={button}
          appearance={appearance}
          compact={compact}
        />
      </CustomLink>
    </ThemeProvider>
  )
}

ButtonLink.propTypes = {
  button: buttonLinkPropTypes,
  appearance: PropTypes.oneOf([
    "dark",
    "white-outline",
    "white",
    "dark-outline",
  ]),
  compact: PropTypes.bool,
}

export default ButtonLink
