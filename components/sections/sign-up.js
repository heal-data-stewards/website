import React from "react"
import { makeStyles } from "@material-ui/core/styles"
import Paper from "@material-ui/core/Paper"
import Grid from "@material-ui/core/Grid"
import CreateAccountForm from "../elements/form/create-account-form"

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    textAlign: "center",
    color: theme.palette.text.secondary,
    backgroundColor: "#fcf8fa",
    width: "100%",
  },
}))

export default function SignUp({ data }) {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <div
      // style={{
      // backgroundImage: "url(" + "/dna.png" + ")",
      // backgroundRepeat: "no-repeat",
      // backgroundSize: "contain",
      // backgroundPosition: "left",
      // minHeight: "500px",

      // }}
      >
        <Grid container spacing={0} className="container">
          {/* <Grid item xs={3} md={3}></Grid> */}
          {/* <Grid item xs={12} md={12}> */}
          <Paper className={classes.paper} elevation={0} square>
            <CreateAccountForm />
          </Paper>
          {/* </Grid> */}
        </Grid>
      </div>
      <br></br>
      <br></br>
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
