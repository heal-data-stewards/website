import { signIn, signOut, useSession, getSession } from "next-auth/client"
import axios from "axios"
import React, { useState, useEffect } from "react"
import { makeStyles } from "@material-ui/core/styles"
import Card from "@material-ui/core/Card"
import CardActions from "@material-ui/core/CardActions"
import CardContent from "@material-ui/core/CardContent"
import Button from "@material-ui/core/Button"
import Typography from "@material-ui/core/Typography"
import Divider from "@material-ui/core/Divider"
import TransitionsModal from "../elements/modal"
import EditForm from "../elements/form/account-edit"
import Avatar from "@material-ui/core/Avatar"
import LoginSection from "./login"
import Link from "next/link"

const useStyles = makeStyles({
  root: {
    minWidth: 275,
    backgroundColor: "#e5e0e645",
  },
  bullet: {
    display: "inline-block",
    margin: "0 2px",
    transform: "scale(0.8)",
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
  large: {
    width: "200px",
    height: "200px",
    margin: "0 auto",
  },
})

const callApi = async function asyncCall(session, setData) {
  const response = await axios
    .get("https://api.healdatafair.org/users/me", {
      headers: {
        Authorization: `Bearer ${session.jwt}`,
      },
    })
    .then(function (response) {
      setData(response.data)
      return response
    })
}

export default function SignIn(initialData) {
  const [session, loading] = useSession()
  const classes = useStyles()
  const [open, setOpen] = React.useState(false)
  const [data, setData] = useState({ ...session })

  useEffect(() => {
    if (session) {
      callApi(session, setData)
    }
  }, [session])

  const handleOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    callApi(session, setData)
    setOpen(false)
  }
  return (
    <div>
      <div>
        {!session && (
          <>
            <LoginSection>
              <Link style={{ color: "#0044b3" }} href="/sign-up">
                Sign Up
              </Link>
            </LoginSection>
            {/* <div className="container mt-8 mb-8">
              <p>Access Denied</p>
              <p>Please Log In</p>
            </div> */}
          </>
        )}
        {/* If Logged in show user profile */}
        {session && (
          <div className="container mt-8 mb-8">
            <div
              className="flex flex-wrap"
              style={{ justifyContent: "center" }}
            >
              <Card
                className={classes.root + " " + "flex-2"}
                style={{ textAlign: "center" }}
              >
                <CardContent>
                  <Avatar
                    alt="alt"
                    src={
                      "https://heal-community-portal-api.s3.amazonaws.com/blank_profile_picture_973460_1280_a29a12e75d.png"
                    }
                    className={classes.large}
                  />
                  <Typography
                    className={classes.title}
                    color="textSecondary"
                    gutterBottom
                  >
                    {session.user.name}
                  </Typography>
                  <Typography variant="h5" component="h2">
                    {data.firstname + " " + data.lastname}
                  </Typography>
                  <Typography className={classes.pos} color="textSecondary">
                    {data.organization}
                  </Typography>
                </CardContent>
              </Card>
              <Card className={classes.root + " " + "flex-1"}>
                <CardContent>
                  <br></br>
                  <div>
                    <span
                      className="text-xl font-bold"
                      style={{ minWidth: "150px", display: "inline-block" }}
                    >
                      Full Name{" "}
                    </span>
                    <span className="text-lg text-gray-dark">
                      {data.firstname + " " + data.lastname}
                    </span>
                  </div>
                  <br></br>
                  <Divider />
                  <br></br>
                  <p>
                    <span
                      className="text-xl font-bold"
                      style={{ minWidth: "150px", display: "inline-block" }}
                    >
                      User Name{" "}
                    </span>
                    <span className="text-lg text-gray-dark">
                      {session.user.name}
                    </span>
                  </p>
                  <br></br>
                  <Divider /> <br></br>
                  <p>
                    <span
                      className="text-xl font-bold"
                      style={{ minWidth: "150px", display: "inline-block" }}
                    >
                      Email{" "}
                    </span>
                    <span className="text-lg text-gray-dark">
                      {session.email}
                    </span>
                  </p>
                  <br></br>
                  <Divider /> <br></br>
                  <div>
                    <span
                      className="text-xl font-bold"
                      style={{ minWidth: "150px", display: "inline-block" }}
                    >
                      Organization{" "}
                    </span>
                    <span className="text-lg text-gray-dark">
                      {data.organization}
                    </span>
                    <br></br> <br></br>
                  </div>
                  <Divider /> <br></br>
                  <div>
                    <span
                      className="text-xl font-bold"
                      style={{
                        minWidth: "150px",
                        paddingRight: "50px",
                        display: "inline-block",
                      }}
                    >
                      What is your role in the HEAL Initiative?
                    </span>
                    <span className="text-lg text-gray-dark">
                      {data.userrole}
                    </span>
                    <br></br> <br></br>
                  </div>
                  <Divider /> <br></br>
                  <div>
                    <span
                      className="text-xl font-bold"
                      style={{
                        minWidth: "150px",
                        paddingRight: "50px",
                        display: "inline-block",
                      }}
                    >
                      If you are working on a HEAL-funded initiative, please
                      choose your program area.
                    </span>
                    <span className="text-lg text-gray-dark">
                      {data.programarea}
                    </span>
                    <br></br> <br></br>
                  </div>
                  <Divider /> <br></br>
                  <div>
                    <span
                      className="text-xl font-bold"
                      style={{
                        minWidth: "150px",
                        paddingRight: "50px",
                        display: "inline-block",
                      }}
                    >
                      If you are working on a HEAL-funded initiative, please
                      share your role.
                    </span>
                    <span className="text-lg text-gray-dark">
                      {/* {console.log(data)} */}
                      {data.roleInProgramArea}
                    </span>
                    <br></br> <br></br>
                  </div>
                  <Button
                    onClick={() => handleOpen()}
                    variant="contained"
                    color={"primary"}
                    style={{ margin: "20px 0 20px 0" }}
                    //   target="_blank"
                    //   rel="noopener noreferrer"
                  >
                    Edit
                  </Button>
                </CardContent>
                <TransitionsModal open={open} handleClose={() => handleClose()}>
                  <EditForm
                    setData={setData}
                    data={data}
                    handleClose={handleClose}
                  />
                </TransitionsModal>
              </Card>
            </div>
          </div>
        )}
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
