import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { isAccessTokenExpired } from "@/lib/auth-tokens"
import { fetchCurrentUser, loginRequest, refreshTokenRequest } from "@/lib/api"
import type { AppUser } from "@/types/types"

export const { handlers, auth, signIn, signOut, unstable_update } = NextAuth({
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
    Credentials({
      id: "token-login",
      name: "token-login",
      credentials: {
        accessToken: { label: "Access Token", type: "text" },
        refreshToken: { label: "Refresh Token", type: "text" },
      },
      async authorize(credentials) {
        const accessToken = credentials?.accessToken as string
        const refreshToken = credentials?.refreshToken as string

        if (!accessToken || !refreshToken) {
          return null
        }

        try {
          const user = await fetchCurrentUser(accessToken)
          if (!user) {
            return null
          }

          return {
            ...user,
            accessToken,
            refreshToken,
          }
        } catch {
          return null
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
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
        delete token.error
      }

      if (trigger === "update" && session) {
        const updatedSession = session as {
          accessToken?: string
          refreshToken?: string
        }

        if (updatedSession.accessToken) {
          token.accessToken = updatedSession.accessToken
        }

        if (updatedSession.refreshToken) {
          token.refreshToken = updatedSession.refreshToken
        }

        delete token.error
      }

      const accessToken = token.accessToken as string | undefined
      const refreshToken = token.refreshToken as string | undefined

      if (
        accessToken &&
        refreshToken &&
        isAccessTokenExpired(accessToken)
      ) {
        try {
          const refreshedTokens = await refreshTokenRequest(refreshToken)
          token.accessToken = refreshedTokens.accessToken
          token.refreshToken = refreshedTokens.refreshToken
          delete token.error
        } catch {
          token.error = "RefreshTokenError"
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
      session.error = token.error as "RefreshTokenError" | undefined

      return session
    },
  },
  trustHost: true,
})
