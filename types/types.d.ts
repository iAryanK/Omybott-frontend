export type ApiError = {
  message?: string
  subErrors?: string[]
}

export type ApiResponseBody<T> = {
  data?: T
  error?: ApiError | null
  timestamp?: string
}

export type LoginRequest = {
  email: string
  password: string
}

export type SignupRequest = {
  name: string
  email: string
  password: string
}

export type AuthResponse = {
  accessToken: string
  refreshToken: string
}

export type SignupResponse = AuthResponse & {
  id: string
}

export type AppUser = {
  id: string
  name: string
  email: string
  verified: boolean
  active: boolean
  createdAt?: string
  updatedAt?: string
}

declare module "next-auth" {
  interface Session {
    user: AppUser
    accessToken: string
    refreshToken: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string
    refreshToken?: string
    user?: AppUser
  }
}
