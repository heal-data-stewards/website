import React from "react"
import { makeStyles } from "@material-ui/core/styles"
import Paper from "@material-ui/core/Paper"
import Grid from "@material-ui/core/Grid"
import CreateAccountForm from "../elements/form/account-create"

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary,
  },
}))

export default function SignUp({ data }) {
  const classes = useStyles()

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
              {/* <div style={{ textAlign: "right", margin: "20px 0 20px 0" }}>
                <span>Already have an account? </span> {props.children}
              </div> */}
              <br></br>
              <div
                style={{
                  textAlign: "left",
                  maxWidth: "600px",
                  margin: "0 auto",
                }}
              >
                <h1 className="text-3xl mb-10 font-bold mb-2">SIGN UP</h1>
              </div>
              <CreateAccountForm />
            </Paper>
          </Grid>
        </Grid>
      </div>
    </div>
  )
}

export async function getServerSideProps({ req }) {
  let headers = {}
  const session = await getSession({ req })
  if (session) {
    headers = { Authorization: `Bearer ${session.jwt}` }
  }
  let journals = []
  try {
    let { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
      headers: headers,
    })
    journals = data
  } catch (e) {
    console.log("caught error")
    journals = []
  }

  return { props: { journals: "journals" } }
}
