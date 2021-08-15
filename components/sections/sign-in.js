import { signIn, signOut, useSession, getSession } from "next-auth/client";
import axios from "axios";

import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";

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
});

export default function SignIn(initialData) {
  const [session, loading] = useSession();
  const classes = useStyles();
  const bull = <span className={classes.bullet}>•</span>;
  return (
    <div className="container mt-8">
      <div>
        {!session && (
          <>
            Not signed in <br />
            <button onClick={() => signIn()}>Sign in</button>
          </>
        )}
        {session && (
          <>
            <div class="flex flex-wrap">
              <Card
                className={classes.root + " " + "flex-initial"}
                style={{ marginRight: "20px", textAlign: "center" }}
              >
                <CardContent>
                  <Typography
                    className={classes.title}
                    color="textSecondary"
                    gutterBottom
                  >
                    {session.user.name}
                  </Typography>
                  <Typography variant="h5" component="h2">
                    {session.firstname + " " + session.lastname}
                  </Typography>
                  <Typography className={classes.pos} color="textSecondary">
                    {session.organization}
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
                      {session.firstname + " " + session.lastname}
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
                      {session.user.email}
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
                      {session.organization}
                    </span>
                    <br></br> <br></br>
                    <Divider />
                  </div>
                </CardContent>
              </Card>
            </div>
            <Button
              onClick={() => signOut()}
              variant="contained"
              color={"primary"}
              style={{ margin: "20px 0 20px 0" }}
              //   target="_blank"
              //   rel="noopener noreferrer"
            >
              Sign out
            </Button>
          </>
        )}
      </div>
      <div>
        {initialData.journals &&
          initialData.journals.map((each, index) => {
            return (
              <div key={index}>
                <h3>{each.username}</h3>
                <p>{each.email}</p>
              </div>
            );
          })}
      </div>
    </div>
  );
}

export async function getServerSideProps({ req }) {
  let headers = {};
  const session = await getSession({ req });
  if (session) {
    headers = { Authorization: `Bearer ${session.jwt}` };
  }
  let journals = [];
  try {
    let { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
      headers: headers,
    });
    journals = data;
  } catch (e) {
    console.log("caught error");
    journals = [];
  }

  return { props: { journals: "journals" } };
}
