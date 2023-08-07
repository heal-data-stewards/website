import React, { Fragment } from "react"
import PropTypes from "prop-types"
import NextLink from "next/link"

const InternalLink = React.forwardRef(function InternalLink(
  { children, className, ...props },
  ref
) {
  return (
    <NextLink {...props}>
      <a ref={ref}>{children}</a>
    </NextLink>
  )
})

//

const ExternalLink = ({ href, children, ...props }) => {
  return (
    <Fragment>
      <a href={href} target="_blank" rel="noopener noreferrer"  {...props}>
        {children}
      </a>
    </Fragment>
  )
}

//

const Link = React.forwardRef(function Link(
  { to, children, ...props },
  ref
) {
  const mailtoPattern = new RegExp(/^mailto:/)
  const externalUrlPattern = new RegExp(/^https?:\/\//)
  const externalUrlMatch = externalUrlPattern.exec(to)
  const mailtoMatch = mailtoPattern.exec(to)
  const LinkComponent =
    externalUrlMatch || mailtoMatch ? ExternalLink : InternalLink
  return (
    <LinkComponent href={to} to={to} ref={ref} {...props}>
      {children}
    </LinkComponent>
  )
})

Link.propTypes = {
  to: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
}

ExternalLink.propTypes = Link.propTypes
ExternalLink.defaultProps = Link.defaultProps

export default Link