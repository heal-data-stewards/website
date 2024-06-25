import React, { Fragment } from "react"
import PropTypes from "prop-types"
import NextLink from "next/link"
import MUILink from "@mui/material/Link"

const InternalLink = React.forwardRef(function InternalLink(
  { children, className, ...props },
  ref
) {
  return (
    <NextLink href={ref} passHref {...props}>
      <MUILink underline="hover" sx={{ fontWeight: "600", color: "#982568" }}>
        {children}
      </MUILink>
    </NextLink>
  )
})

//

const ExternalLink = ({ href, children, darkBackground, ...props }) => {
  return (
    <Fragment>
      <MUILink
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        underline="hover"
        sx={{
          fontWeight: "600",
          color: darkBackground ? "#EFBDDA" : "#982568",
        }}
        {...props}
      >
        {children}
      </MUILink>
    </Fragment>
  )
}

//

const CustomLink = React.forwardRef(function Link(
  { to, children, darkBackground, ...props },
  ref
) {
  const mailtoPattern = new RegExp(/^mailto:/)
  const externalUrlPattern = new RegExp(/^https?:\/\//)
  const externalUrlMatch = externalUrlPattern.exec(to)
  const mailtoMatch = mailtoPattern.exec(to)
  const LinkComponent =
    externalUrlMatch || mailtoMatch ? ExternalLink : InternalLink
  return (
    <LinkComponent
      href={to}
      to={to}
      ref={ref}
      darkBackground={darkBackground}
      {...props}
    >
      {children}
    </LinkComponent>
  )
})

CustomLink.propTypes = {
  to: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
}

ExternalLink.propTypes = CustomLink.propTypes
ExternalLink.defaultProps = CustomLink.defaultProps

export default CustomLink
