import React, { useState } from "react"
import { makeStyles } from "@material-ui/core/styles"
import Paper from "@material-ui/core/Paper"
import Grid from "@material-ui/core/Grid"
import LoginForm from "../elements/form/login"
import NewPasswordForm from "../elements/form/password-recovery"
import Link from "next/link"

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary,
    background: "#fcf8fa",
  },
}))

export default function LoginSection(props) {
  const classes = useStyles()
  const [showPasswordReset, setShowPasswordReset] = useState(false)

  return (
    <div className={classes.root}>
      <div>
        <Grid container spacing={0} className="container">
          <Grid item xs={12} md={3}></Grid>
          <Grid item xs={12} md={9}>
            <Paper className={classes.paper} elevation={0} square>
              <div style={{ textAlign: "right", margin: "20px 0 20px 0" }}>
                <span>Need an account? </span>{" "}
                <span style={{ color: "#532565" }}>
                  <Link style={{ color: "#0044b3" }} href="/sign-up">
                    Sign Up
                  </Link>
                </span>
              </div>
              <br></br>
              <div
                style={{
                  textAlign: "left",
                  maxWidth: "600px",
                  margin: "0 auto",
                }}
              >
                <h1 className="text-3xl font-bold">
                  {!showPasswordReset ? "LOGIN" : "PASSWORD RESET"}
                </h1>
              </div>

              {!showPasswordReset ? <LoginForm /> : <NewPasswordForm />}
              {!showPasswordReset && (
                <div style={{ marginTop: "-23px", color: "#532565" }}>
                  <button
                    onClick={() => setShowPasswordReset(!showPasswordReset)}
                  >
                    Forgot Password
                  </button>
                </div>
              )}
            </Paper>
          </Grid>
        </Grid>
      </div>
    </div>
  )
}
