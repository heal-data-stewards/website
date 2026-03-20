import React from "react"
import PropTypes from "prop-types"
import Grid from "@mui/material/Grid"
import { withStyles } from "@mui/styles"
import AppBar from "@mui/material/AppBar"
import Toolbar from "@mui/material/AppBar"
import TextField from "@mui/material/TextField"
import { Search } from "@mui/icons-material"

const styles = (theme) => ({
  paper: {
    maxWidth: 936,
    margin: "auto",
    overflow: "hidden",
  },
  searchBar: {
    borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
    backgroundColor: "transparent",
    zIndex: "1",
  },
  searchInput: {
    fontSize: "0.875rem",
    color: "#fff",
    height: "40px",
  },
  block: {
    display: "block",
    color: "#fff",
  },
  contentWrapper: {
    margin: "40px 16px",
  },
  iconButton: {
    margin: "0 40px 0 0",
  },
})

function MeilieSearchBar(props) {
  const { classes, currentRefinement, refine } = props
  //   const lowercasedFilter = filter.toLowerCase();

  return (
    <AppBar className={classes.searchBar} position="relative" elevation={0}>
      <Toolbar
        position="relative"
        style={{ backgroundColor: "rgb(152 37 104)" }}
      >
        <Grid container spacing={2} alignItems="center">
          <Grid item></Grid>
          <Grid item>
            <Search className={classes.block} color="inherit" />
          </Grid>
          <Grid item xs>
            <TextField
              fullWidth
              onChange={(e) => refine(e.currentTarget.value)}
              placeholder="Search"
              value={currentRefinement}
              InputProps={{
                disableUnderline: true,
                className: classes.searchInput,
              }}
              style={{ color: "#fff" }}
            />
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  )
}

MeilieSearchBar.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(MeilieSearchBar)
