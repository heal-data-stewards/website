import React from "react"
import PropTypes from "prop-types"
import { withStyles } from "@material-ui/core/styles"
import ExpansionPanel from "@material-ui/core/ExpansionPanel"
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary"
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails"
import Typography from "@material-ui/core/Typography"
import ExpandMoreIcon from "@material-ui/icons/ExpandMore"

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
          <ExpansionPanel key={faq.question + i}>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
              <Typography className={classes.heading}>
                {faq.question}
              </Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <Typography>{faq.answer}</Typography>
            </ExpansionPanelDetails>
          </ExpansionPanel>
        )
      })}
    </div>
  )
}

SimpleExpansionPanel.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(SimpleExpansionPanel)
