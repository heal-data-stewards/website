import React from "react"
import PropTypes from "prop-types"
import Grid from "@mui/material/Grid"
import IconButton from "@mui/material/IconButton"
import { withStyles } from "@mui/styles"
import AppBar from "@mui/material/AppBar"
import Toolbar from "@mui/material/AppBar"
import TextField from "@mui/material/TextField"
import Tooltip from "@mui/material/Tooltip"
import { Refresh, Search } from "@mui/icons-material"

const styles = () => ({
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

function SearchBar(props) {
  const { classes, filter, setFilter } = props

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
              onChange={(e) => setFilter(e.currentTarget.value)}
              placeholder="Search"
              value={filter}
              size="small"
              InputProps={{
                disableUnderline: true,
                sx: { color: "#fff" },
              }}
              sx={{ height: "40px" }}
            />
          </Grid>
          <Grid item>
            <Tooltip title="Reload">
              <IconButton>
                <Refresh
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

SearchBar.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(SearchBar)
