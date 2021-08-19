import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import LoginForm from "../elements/form/login";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary,
  },
}));

export default function LoginSection(props) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div
      // style={{
      //   backgroundImage: "url(" + "/dna.png" + ")",
      //   backgroundRepeat: "no-repeat",
      //   backgroundSize: "contain",
      //   backgroundPosition: "left",
      //   minHeight: "500px",
      // }}
      >
        <Grid container spacing={0} className="container">
          <Grid item xs={12} md={3}></Grid>
          <Grid item xs={12} md={9}>
            <Paper className={classes.paper} elevation={0} square>
              <div style={{ textAlign: "right", margin: "20px 0 20px 0" }}>
                <span>Need an account? </span> {props.children}
              </div>
              <br></br>
              <div
                style={{
                  textAlign: "left",
                  maxWidth: "600px",
                  margin: "0 auto",
                }}
              >
                <h1 className="text-3xl mb-10 font-bold mb-2">
                  Lorem Ipsum login text etc dsk jgfhs no dolphins allowed
                </h1>
              </div>
              <LoginForm />
            </Paper>
          </Grid>
        </Grid>
      </div>
    </div>
  );
}
