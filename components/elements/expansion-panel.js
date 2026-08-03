import React from "react"
import PropTypes from "prop-types"
import { withStyles } from "@mui/styles"
import Typography from "@mui/material/Typography"
import { Accordion, AccordionSummary, AccordionDetails } from "@mui/material"
import { ExpandMore } from "@mui/icons-material"

const styles = (theme) => ({
  root: {
    width: "100%",
  },
  heading: {
    fontSize: "0.9375rem",
  },
})

function SimpleExpansionPanel({ classes, data }) {
  return (
    <div className={classes.root}>
      {data.map((faq, i) => {
        return (
          <Accordion key={faq.question + i}>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography className={classes.heading}>
                {faq.question}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>{faq.answer}</Typography>
            </AccordionDetails>
          </Accordion>
        )
      })}
    </div>
  )
}

SimpleExpansionPanel.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(SimpleExpansionPanel)
