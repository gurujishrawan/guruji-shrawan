import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"
import { redirect } from "next/navigation"

export const { handlers, signIn, signOut, auth } = NextAuth({

  providers: [

    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    Credentials({
      credentials: {
        username: {},
        password: {},
      },

      async authorize(credentials) {

        if (
          credentials?.username === process.env.ADMIN_USER &&
          credentials?.password === process.env.ADMIN_PASS
        ) {
          return {
            id: "1",
            name: "Admin",
            email: "admin@guruji.com"
          }
        }

        return null
      },
    }),

  ],

  pages: {
    signIn: "/signin"
  }

})

/* -----------------------------
   REGISTER USER (for signup)
--------------------------------*/

export async function registerUser({
  name,
  username,
  password,
  redirectTo,
}: {
  name: string
  username: string
  password: string
  redirectTo: string
}) {

  if (!name || !username || password.length < 6) {
    redirect("/signup?error=InvalidInput")
  }

  // TODO: Save user to database
  console.log("New user:", { name, username, password })

  redirect(redirectTo)
}