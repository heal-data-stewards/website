import PropTypes from "prop-types"
import { linkPropTypes, mediaPropTypes } from "utils/types"
import NextImage from "./image"
import Image from "next/image"
import CustomLink from "./custom-link"
import { styled } from "@material-ui/core/styles"
import { ExpandLess } from "@mui/icons-material"

const Footer = ({ footer, pageContext }) => {
  return (
    <StyledFooter isFullscreen={pageContext.isFullscreen}>
      {pageContext.isFullscreen && (
        <div className="flex flex-col items-center justify-center text-purple border-b-[1px] border-[#4d286273] p-1 h-[32px] cursor-pointer">
          <div className="flex gap-1 items-center">
            <ExpandLess fontSize="small" />
            <span className="font-semibold text-base">Footer</span>
          </div>
        </div>
      )}
      <div className="pt-12 container flex flex-col lg:flex-row lg:justify-between">
        <div>
          {footer.logo && (
            <div>
              <Image
                src={`${footer.logo.url}`}
                style={{ margin: "7px" }}
                width="255"
                height="77"
                layout="intrinsic"
                alt={`${footer.logo.alternativeText || ""}`}
              />
              <p
                style={{
                  marginTop: "20px",
                  maxWidth: "420px",
                  marginBottom: "45px",
                  color: "#000",
                }}
              >
                The HEAL Data Stewardship Group is funded by the The NIH HEAL
                Initiative. NIH HEAL Initiative and Helping to End Addiction
                Long-term are service marks of the U.S. Department of Health and
                Human Services.
              </p>
            </div>
          )}
        </div>
        <nav className="flex flex-wrap flex-row lg:gap-20 items-start lg:justify-end mb-10">
          {footer.columns.map((footerColumn) => (
            <div
              key={footerColumn.id}
              className="mt-10 lg:mt-0 w-6/12 lg:w-auto"
            >
              <p className="uppercase tracking-wide font-semibold">
                {footerColumn.title}
              </p>
              <ul className="mt-2">
                {footerColumn.links.map((link) => (
                  <li
                    key={link.id}
                    className="text-white-700 py-1 px-1 -mx-1 hover:text-white-900"
                  >
                    <CustomLink link={link}>{link.text}</CustomLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>
      <div className="text-sm bg-purple py-6 text-white">
        <div className="container">{footer.smallText}</div>
      </div>
    </StyledFooter>
  )
}

const StyledFooter = styled("footer")(({ isFullscreen }) => ({
  backgroundColor: "#e5e0e7",
  ...(isFullscreen && {
    zIndex: 10000,
    position: "absolute",
    bottom: "0px",
    left: "0px",
    right: "0px",
    transition: "transform 400ms ease-in-out",
    transform: "translateY(calc(100% - 32px))",
    "&:hover": {
      transform: "none",
      "& .MuiSvgIcon-root": {
        transform: "rotate(180deg)",
        transition: "transform 400ms ease-in-out",
      },
    },
    "& .MuiSvgIcon-root": {
      transition: "transform 400ms ease-in-out",
    },
  }),
}))

Footer.propTypes = {
  footer: PropTypes.shape({
    logo: mediaPropTypes.isRequired,
    columns: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
          .isRequired,
        title: PropTypes.string.isRequired,
        links: PropTypes.arrayOf(linkPropTypes),
      })
    ),
    smallText: PropTypes.string.isRequired,
  }),
}

export default Footer
