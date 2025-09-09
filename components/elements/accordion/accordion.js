import React from "react"
import { styled } from "@mui/material/styles"
import MuiAccordion from "@mui/material/Accordion"
import MuiAccordionSummary from "@mui/material/AccordionSummary"
import MuiAccordionDetails from "@mui/material/AccordionDetails"
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp"

export const Accordion = React.memo(
  styled(
    React.forwardRef(function AccordionFwd(props, ref) {
      console.log("[Accordion render]", props.expanded)
      return (
        <MuiAccordion
          ref={ref}
          disableGutters
          elevation={0}
          square
          {...props}
        />
      )
    })
  )(({ theme }) => ({
    "&:not(:last-child)": {
      borderBottom: 0,
    },
    background: "linear-gradient(315deg, transparent 17px, #e5e0e7 0)",
    marginBottom: "1rem",
    "& .MuiAccordionSummary-root": {
      padding: "0.25rem 1rem",
      display: "flex",
      justifyContent: "space-between",
    },
  }))
)

export const AccordionSummary = styled((props) => (
  <MuiAccordionSummary
    expandIcon={
      <ArrowForwardIosSharpIcon
        sx={{
          fontSize: "2rem",
          padding: "0.75rem 0.5rem 0.5rem 0",
          color: "#532565",
        }}
      />
    }
    {...props}
  />
))(({ theme }) => ({
  "& .MuiAccordionSummary-expandIconWrapper": {
    transform: "rotate(90deg)",
  },
  "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
    transform: "rotate(270deg)",
  },
  "& .MuiSvgIcon-root": {
    padding: "0.5rem",
  },
  h3: {
    paddingBottom: 0,
  },
}))

export const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  border: "1px solid #e5e0e7",
  color: "#532565",
  wordWrap: "break-word",
  overflowWrap: "break-word",
  wordBreak: "break-word",
  p: {
    fontSize: "0.95rem",
  },
  backgroundColor: "#fff",
}))
