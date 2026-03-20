import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import axios from "axios"

export default NextAuth({
  providers: [
    CredentialsProvider({
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
            return data
          } else {
            return null
          }
        } catch (e) {
          return null
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/account",
    signOut: "/account",
    error: "/sign-up",
  },
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.jwt = user.jwt
        token.id = user.user.id
        token.name = user.user.username
        token.email = user.user.email
        token.firstname = user.user.firstname
        token.lastname = user.user.lastname
        token.organization = user.user.organization
        token.userrole = user.user.userrole
        token.programarea = user.user.programarea
        token.roleInProgramArea = user.user.roleInProgramArea
      }
      return token
    },
    redirect: async ({ url, baseUrl }) => {
      return url.startsWith(baseUrl) ? url : baseUrl
    },
    session: async ({ session, token }) => {
      session.jwt = token.jwt
      session.id = token.id
      session.firstname = token.firstname
      session.lastname = token.lastname
      session.email = token.email
      session.organization = token.organization
      session.userrole = token.userrole
      session.programarea = token.programarea
      session.roleInProgramArea = token.roleInProgramArea
      return session
    },
  },
})
