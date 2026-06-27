import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { fetchCurrentUser, loginRequest } from "@/lib/api"
import type { AppUser } from "@/types/types"

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email
        const password = credentials?.password

        if (!email || !password) {
          return null
        }

        const tokens = await loginRequest({
          email: String(email),
          password: String(password),
        })

        if (!tokens) {
          return null
        }

        const user = await fetchCurrentUser(tokens.accessToken)

        return {
          ...user,
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
        }
      },
    }),
    // Google provider can be added here later, e.g. Google({ clientId, clientSecret })
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const authUser = user as AppUser & {
          accessToken: string
          refreshToken: string
        }

        token.accessToken = authUser.accessToken
        token.refreshToken = authUser.refreshToken
        token.user = {
          id: authUser.id,
          name: authUser.name,
          email: authUser.email,
          verified: authUser.verified,
          active: authUser.active,
          createdAt: authUser.createdAt,
          updatedAt: authUser.updatedAt,
        }
      }

      return token
    },
    async session({ session, token }) {
      const user = token.user as AppUser | undefined

      if (user) {
        session.user = user as typeof session.user
      }

      session.accessToken = (token.accessToken as string | undefined) ?? ""
      session.refreshToken = (token.refreshToken as string | undefined) ?? ""

      return session
    },
  },
  trustHost: true,
})
