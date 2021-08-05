import Link from "next/link";
import PropTypes from "prop-types";
import { linkPropTypes } from "utils/types";
import Button from "@material-ui/core/Button";
import { createTheme, ThemeProvider } from "@material-ui/core/styles";

const theme = createTheme({
  palette: {
    primary: {
      light: "#c0b3c5",
      main: "#982568",
      dark: "#532565",
      contrastText: "#fff",
    },
  },
});

const CustomLink = ({ link, children }) => {
  const isInternalLink = link.url.startsWith("/");

  // For internal links, use the Next.js Link component
  if (isInternalLink) {
    return (
      <Link href="/[[...slug]]" as={link.url}>
        <a>{children}</a>
      </Link>
    );
  }

  // Plain <a> tags for external links
  if (link.newTab) {
    return (
      <ThemeProvider theme={theme}>
        <Button
          variant="contained"
          color="primary"
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
        >
          {children}
        </Button>
      </ThemeProvider>
    );
  }

  return (
    <a href={link.url} target="_self">
      {children}
    </a>
  );
};

CustomLink.propTypes = {
  link: linkPropTypes,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
};

export default CustomLink;
