import React, { useState, useEffect } from "react"
import { styled } from "@mui/material/styles"
import MuiAccordion from "@mui/material/Accordion"
import MuiAccordionSummary from "@mui/material/AccordionSummary"
import MuiAccordionDetails from "@mui/material/AccordionDetails"
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp"

export const Accordion = styled((props) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  "&:not(:last-child)": {
    borderBottom: 0,
  },
  "&:before": {
    display: "none",
  },
  background: "linear-gradient(315deg, transparent 17px, #e5e0e7 0)",
  marginBottom: "1rem",
}))

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
  flexDirection: "row",
  "& .MuiAccordionSummary-expandIconWrapper": {
    transform: "rotate(90deg)",
  },
  "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
    transform: "rotate(270deg)",
  },
  "& .MuiAccordionSummary-content": {
    marginLeft: theme.spacing(1),
  },
  "& .MuiSvgIcon-root": {
    padding: "0.5rem",
  },
  color: "#532565",
  fontWeight: "600",
}))

// the wrap styles below ensure that long urls don't cause the accordion
// container to extend past the edge of the page container
export const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: "0rem 2.6rem 1rem",
  // borderTop: "1px solid rgba(0, 0, 0, .125)",
  border: "none",
  color: "#532565",
  wordWrap: "break-word",
  overflowWrap: "break-word",
  "-ms-word-break": "break-all",
  wordBreak: "break-word",
}))
