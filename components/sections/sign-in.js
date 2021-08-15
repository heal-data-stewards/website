import { signIn, signOut, useSession, getSession } from "next-auth/client";
import axios from "axios";

export default function SignIn(initialData) {
  const [session, loading] = useSession();

  return (
    <div className="container">
      <div>
        {!session && (
          <>
            Not signed in <br />
            <button onClick={() => signIn()}>Sign in</button>
          </>
        )}
        {session && (
          <>
            Signed in as {session.user.email} <br />
            <button onClick={() => signOut()}>Sign out</button>
          </>
        )}
      </div>
      <div>
        {console.log(initialData)}
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
    console.log(data);
    journals = data;
  } catch (e) {
    console.log("caught error");
    journals = [];
  }

  return { props: { journals: "journals" } };
}
