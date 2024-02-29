import { Tooltip } from "@mui/material"
import { useEffect, useRef, useState } from "react"
import { tooltipClasses } from "@mui/material/Tooltip"
import { styled } from "@mui/material/styles"

const RenderExpandableCell = (props) => {
  const [isOverflowed, setIsOverflow] = useState(true)

  const textElementRef = useRef(null)

  const checkOverflow = () => {
    // Using getBoundingClientRect, instead of scrollWidth and clientWidth, to get width with fractional accuracy
    const clientWidth = textElementRef.current.getBoundingClientRect().width

    textElementRef.current.style.overflow = "visible"
    const contentWidth = textElementRef.current.getBoundingClientRect().width
    textElementRef.current.style.overflow = "hidden"

    setIsOverflow(contentWidth > clientWidth)
  }

  useEffect(() => {
    checkOverflow()
    window.addEventListener("resize", checkOverflow)
    return () => {
      window.removeEventListener("resize", checkOverflow)
    }
  }, [])

  const HtmlTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} classes={{ popper: className }} />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: "#542665",
      color: "#fff",
      maxWidth: 290,
      fontSize: "1rem",
      border: "1px solid #dadde9",
      marginTop: "0 !important",
    },
  }))

  return (
    <HtmlTooltip title={props.children} disableHoverListener={!isOverflowed}>
      <span
        ref={textElementRef}
        style={{
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {props.children}
      </span>
    </HtmlTooltip>
  )
}

export default RenderExpandableCell
