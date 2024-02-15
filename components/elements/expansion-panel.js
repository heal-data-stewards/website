import React from "react"
import PropTypes from "prop-types"
import { withStyles } from "@mui/material"
import Typography from "@mui/material/Typography"
import AccordionDetails from "@mui/material/AccordionDetails"
import AccordionSummary from "@mui/material/AccordionSummary"
import Accordion from "@mui/material/Accordion"
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const styles = (theme) => ({
  root: {
    width: "100%",
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
})

function SimpleExpansionPanel({ classes, data }) {
  return (
    <div className={classes.root}>
      {data.map((faq, i) => {
        return (
          <Accordion key={faq.question + i}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
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
