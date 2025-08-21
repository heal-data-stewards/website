// import { styled } from '@mui/material/styles';
// import MuiAccordion from '@mui/material/Accordion';
// import MuiAccordionSummary from '@mui/material/AccordionSummary';
// import MuiAccordionDetails from '@mui/material/AccordionDetails';

import { ArrowForwardIosSharp } from "@mui/icons-material"
import {
  Chip,
  Accordion as MuiAccordion,
  AccordionDetails as MuiAccordionDetails,
  AccordionSummary as MuiAccordionSummary,
  styled,
} from "@mui/material"
import { useState } from "react"

const Accordion = styled((props) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  "&:not(:last-child)": {
    borderBottom: 0,
  },
  "&::before": {
    display: "none",
  },
}))

const AccordionSummary = styled((props) => (
  <MuiAccordionSummary
    expandIcon={<ArrowForwardIosSharp sx={{ fontSize: "100%" }} />}
    {...props}
  />
))(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === "dark"
      ? "rgba(255, 255, 255, .05)"
      : "rgba(0, 0, 0, .03)",
  flexDirection: "row-reverse",
  width: "100%",
  padding: "0px 1rem !important",
  "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
    transform: "rotate(90deg)",
  },
  "& .MuiAccordionSummary-content": {
    marginLeft: theme.spacing(1),
  },
}))

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: "1px solid rgba(0, 0, 0, .125)",
  maxHeight: "50dvh",
  overflow: "auto",
}))

/**
 * @param {{ items: Array<{ key: string, summary: React.ReactNode, details: React.ReactNode }> }} props
 */
export default function StyledAccordion({ items }) {
  const [expanded, setExpanded] = useState(null)

  const handleChange = (panel) => (_, newExpanded) => {
    setExpanded(newExpanded ? panel : false)
  }

  return (
    <div>
      {items.map((item, index) => (
        <Accordion
          key={`${item.key}-${index}`}
          expanded={expanded === `panel${index}`}
          onChange={handleChange(`panel${index}`)}
        >
          <AccordionSummary
            aria-controls={`panel${index}d-content`}
            id={`panel${index}d-header`}
          >
            {item.summary}
          </AccordionSummary>
          <AccordionDetails>{item.details}</AccordionDetails>
        </Accordion>
      ))}
    </div>
  )
}
