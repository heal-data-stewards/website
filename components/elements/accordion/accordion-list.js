import { Typography } from "@mui/material"
import { Accordion, AccordionSummary, AccordionDetails } from "./"
import Markdown from "../markdown"

export const AccordionList = ({ sections, expandedStates, handleToggle }) => (
  <div>
    {sections.map((section, index) => (
      <Accordion
        key={index}
        id={`accordion-${index}`}
        expanded={!!expandedStates[index]}
        onChange={(e, isExpanded) => handleToggle(index, isExpanded)}
        sx={{ width: "100%", mb: 1 }}
      >
        <AccordionSummary>
          <Typography
            variant="h3"
            sx={{
              fontSize: { xs: "1rem", sm: "1.25rem", md: "1.5rem" },
            }}
          >
            {section.title}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Markdown>{section.content}</Markdown>
        </AccordionDetails>
      </Accordion>
    ))}
  </div>
)

export default AccordionList
