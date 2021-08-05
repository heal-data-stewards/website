import React from "react";
import PropTypes from "prop-types";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import { withStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import Avatar from "@material-ui/core/Avatar";
import DeleteIcon from "@material-ui/icons/Delete";
import EventAvailableTwoToneIcon from "@material-ui/icons/EventAvailableTwoTone";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/AppBar";
import SearchIcon from "@material-ui/icons/Search";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Tooltip from "@material-ui/core/Tooltip";
import RefreshIcon from "@material-ui/icons/Refresh";
import { ContactSupportOutlined } from "@material-ui/icons";
import EditTwoToneIcon from "@material-ui/icons/EditTwoTone";

const styles = (theme) => ({
  paper: {
    maxWidth: 936,
    margin: "auto",
    overflow: "hidden",
  },
  searchBar: {
    borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
  },
  searchInput: {
    fontSize: theme.typography.fontSize,
  },
  block: {
    display: "block",
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
});

function SearchBar(props) {
  const { classes, filter, setFilter } = props;
  //   const lowercasedFilter = filter.toLowerCase();

  return (
    <>
      <AppBar
        className={classes.searchBar}
        position="unset"
        color="default"
        elevation={0}
      >
        <Toolbar position="unset">
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
              />
            </Grid>
            <Grid item>
              {/* <Button
                variant="contained"
                color="primary"
                className={classes.addUser}
              >
                Search
              </Button> */}
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
    </>
  );
}

SearchBar.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SearchBar);
