import NextAuth from "next-auth"
import Providers from "next-auth/providers"
import axios from "axios"

const options = {
  providers: [
    Providers.Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "test@test.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const { data } = await axios.post(
            `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/auth/local`,
            {
              identifier: credentials.email,
              password: credentials.password,
            }
          )
          if (data) {
            // console.log(data);
            return data
          } else {
            return null
          }
        } catch (e) {
          // console.log('caught error');
          // const errorMessage = e.response.data.message
          // Redirecting to the login page with error message          in the URL
          // throw new Error(errorMessage + '&email=' + credentials.email)
          return null
        }
      },
    }),
  ],
  database: process.env.NEXT_PUBLIC_DATABASE_URL,
  session: {
    jwt: true,
  },
  pages: {
    signIn: "/account",
    signOut: "/account",
    error: "/sign-up", // Error code passed in query string as ?error=
  },

  callbacks: {
    // Getting the JWT token from API response
    jwt: async (token, user, account) => {
      const isSignIn = user ? true : false
      if (isSignIn) {
        token.jwt = user.jwt
        token.id = user.user.id
        token.name = user.user.username
        token.email = user.user.email
        token.firstname = user.user.firstname
        token.lastname = user.user.lastname
        token.organization = user.user.organization
        // token.picture = user.user.picture.url;
      }

      return Promise.resolve(token)
    },
    redirect: async (url, baseUrl) => {
      console.log(url)
      console.log(baseUrl)
      return url.startsWith(baseUrl)
        ? Promise.resolve(url)
        : Promise.resolve(baseUrl)
    },
    session: async (session, user) => {
      session.jwt = user.jwt
      session.id = user.id
      session.firstname = user.firstname
      session.lastname = user.lastname
      session.organization = user.organization
      // session.picture = user.picture;
      return Promise.resolve(session)
    },
  },
}

const Deliver = (req, res) => NextAuth(req, res, options)

export default Deliver
