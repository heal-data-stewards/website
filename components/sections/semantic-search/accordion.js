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

export default function SSAccordion({ studies, selectedStudyFilters }) {
  const [expanded, setExpanded] = useState(null)

  const handleChange = (panel) => (_, newExpanded) => {
    setExpanded(newExpanded ? panel : false)
  }

  const flattenedStudies = Object.entries(studies).reduce(
    (acc, [type, items]) => {
      if (!selectedStudyFilters.includes(type)) {
        acc.push(...items.map((item) => ({ ...item, type })))
      }
      return acc
    },
    []
  )

  return (
    <div>
      {flattenedStudies.map((study, index) => (
        <Accordion
          key={`${study.c_title}-${study.c_id}`}
          expanded={expanded === `panel${index}`}
          onChange={handleChange(`panel${index}`)}
        >
          <AccordionSummary
            aria-controls={`panel${index}d-content`}
            id={`panel${index}d-header`}
          >
            <div className="flex flex-1">
              <div className="flex flex-col flex-1">
                <span>{study.c_name}</span>
                <div>
                  <Chip variant="outlined" size="small" label={study.type} />
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href={study.c_link}
                    className="ml-2 text-blue-600 hover:underline"
                  >
                    {study.c_id}
                  </a>
                </div>
              </div>
              <span className="text-gray-500">
                {study.elements.length}{" "}
                {study.elements.length > 1 ? "elements" : "element"}
              </span>
            </div>
          </AccordionSummary>
          <AccordionDetails>
            <pre>{JSON.stringify(study.elements, null, 2)}</pre>
          </AccordionDetails>
        </Accordion>
      ))}
    </div>
  )
}
