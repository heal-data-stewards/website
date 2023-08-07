import ReactMarkdown from "react-markdown"
import React, { Fragment } from "react"
import PropTypes from 'prop-types'
import NextLink from 'next/link'

const InternalLink = React.forwardRef(function InternalLink({ children, className, ...props }, ref) {
  return (
    <NextLink { ...props }>
      <a ref={ ref }>{ children }</a>
    </NextLink>
  )
})

//

const ExternalLink = ({ href, children, ...props }) => {
  return (
    <Fragment>
      <a
        href={ href }
        target="_blank"
        rel="noopener noreferrer"
        { ...props }
      >
        { children }
      </a>
    </Fragment>
  )
}

//

const CustomLink = React.forwardRef(function CustomLink({ to, children, ...props }, ref) {
  const mailtoPattern = new RegExp(/^mailto:/)
  const externalUrlPattern = new RegExp(/^https?:\/\//)
  const externalUrlMatch = externalUrlPattern.exec(to)
  const mailtoMatch = mailtoPattern.exec(to)
  const LinkComponent = externalUrlMatch || mailtoMatch ? ExternalLink : InternalLink
  return (
    <LinkComponent href={ to } to={ to } ref={ ref } { ...props }>
      { children }
    </LinkComponent>
  )
})

CustomLink.propTypes = {
  to: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
}

ExternalLink.propTypes = CustomLink.propTypes
ExternalLink.defaultProps = CustomLink.defaultProps



// this object defines a map:
//    DOM elements --> React components.
// this allows us to streamline styles for content coming
// from Strapi with that of content built here by Nextjs.

const componentMap = {
  // for links, we'll use our smart link component.
  a: ({ node, href, ...props }) => (
    <CustomLink
      to={ href }
      { ...props }
    />
  ),
  p: ({ node, children, ...props })=>(
    <p style={{ paddingBottom: "1rem" }}>{children}</p>
  ),
}

const Markdown = ({ children }) => {

  return <ReactMarkdown components={componentMap}>{children}</ReactMarkdown>
}

export default Markdown
