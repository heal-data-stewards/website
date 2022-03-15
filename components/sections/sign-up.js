import React from "react"
import { makeStyles } from "@material-ui/core/styles"
import Paper from "@material-ui/core/Paper"
import Grid from "@material-ui/core/Grid"
import CreateAccountForm from "../elements/form/create-account-form"

const useStyles = makeStyles((theme) => ({
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
    <>
      <Grid container spacing={0} className="container">
        <Paper className={classes.paper} elevation={0} square>
          <CreateAccountForm />
        </Paper>
      </Grid>
      <br></br>
      <br></br>
    </>
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
