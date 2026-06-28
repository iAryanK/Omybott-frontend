export type ApiError = {
  status?: number
  message?: string
  subErrors?: string[]
}

export type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: ApiError }

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

export type Workspace = {
  id: string
  name: string
  slug: string
  active: boolean
  createdAt?: string
  updatedAt?: string
}

export type BotStatus = "ACTIVE" | "INACTIVE"

export type Bot = {
  id: string
  name: string
  description?: string
  slug: string
  welcomeMessage: string
  primaryColor: string
  allowedDomains?: string[]
  status: BotStatus
}

export type CreateWorkspaceRequest = {
  name: string
  active: boolean
}

export type CreateBotRequest = {
  name: string
  description: string
  slug: string
  welcomeMessage: string
  primaryColor: string
  allowedDomains: string[]
  status?: BotStatus
}

declare module "next-auth" {
  interface Session {
    user: AppUser
    accessToken: string
    refreshToken: string
    error?: "RefreshTokenError"
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string
    refreshToken?: string
    user?: AppUser
    error?: "RefreshTokenError"
  }
}
