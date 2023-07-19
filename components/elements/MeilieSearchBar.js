import React from "react"
import PropTypes from "prop-types"
import Grid from "@material-ui/core/Grid"
import { withStyles } from "@material-ui/core/styles"
import AppBar from "@material-ui/core/AppBar"
import Toolbar from "@material-ui/core/AppBar"
import SearchIcon from "@material-ui/icons/Search"
import TextField from "@material-ui/core/TextField"

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
    fontSize: theme.typography.fontSize,
    color: "#fff",
    height: "40px",
  },
  block: {
    display: "block",
    color: "#fff",
  },
  addUser: {
    marginRight: theme.spacing(1),
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
            <SearchIcon className={classes.block} color="inherit" />
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
