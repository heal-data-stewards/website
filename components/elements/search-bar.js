import React from "react"
import PropTypes from "prop-types"
import Typography from "@material-ui/core/Typography"
import Grid from "@material-ui/core/Grid"
import IconButton from "@material-ui/core/IconButton"
import { withStyles } from "@material-ui/core/styles"
import AppBar from "@material-ui/core/AppBar"
import Toolbar from "@material-ui/core/AppBar"
import SearchIcon from "@material-ui/icons/Search"
import TextField from "@material-ui/core/TextField"
import Tooltip from "@material-ui/core/Tooltip"
import RefreshIcon from "@material-ui/icons/Refresh"

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

function UniversalSearchBar(props) {
  const { classes, filter, setFilter } = props
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
              onChange={(e) => setFilter(e.currentTarget.value)}
              placeholder="Search"
              value={filter}
              InputProps={{
                disableUnderline: true,
                className: classes.searchInput,
              }}
              style={{ color: "#fff" }}
            />
          </Grid>
          <Grid item>
            <Tooltip title="Reload">
              <IconButton>
                <RefreshIcon
                  className={classes.block}
                  color="inherit"
                  onClick={() => setFilter("")}
                />
              </IconButton>
            </Tooltip>
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  )
}

UniversalSearchBar.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(UniversalSearchBar)
