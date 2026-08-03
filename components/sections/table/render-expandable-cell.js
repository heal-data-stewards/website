import { Tooltip } from "@mui/material"
import { useEffect, useRef, useState } from "react"
import { tooltipClasses } from "@mui/material/Tooltip"
import { styled } from "@mui/material/styles"

const RenderExpandableCell = (props) => {
  const [isOverflowed, setIsOverflow] = useState(false)

  const textElementRef = useRef(null)

  const checkOverflow = () => {
    const el = textElementRef.current
    if (!el) return

    const isOverflowing = el.scrollWidth > el.clientWidth
    setIsOverflow(isOverflowing)
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
          display: "block",
          width: "100%",
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
