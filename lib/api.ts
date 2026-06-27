import type {
  ApiResponseBody,
  AppUser,
  AuthResponse,
  SignupRequest,
} from "@/types/types"

export function getApiBaseUrl() {
  return process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080"
}

export async function parseErrorMessage(response: Response): Promise<string> {
  try {
    const body = (await response.json()) as ApiResponseBody<unknown>
    const message = body.error?.message
    const subErrors = body.error?.subErrors

    if (subErrors?.length) {
      return subErrors.join(", ")
    }

    if (message) {
      return message
    }
  } catch {
    // fall through to default message
  }

  return "Something went wrong. Please try again."
}

export async function parseApiResponse<T>(response: Response): Promise<T> {
  const body = (await response.json()) as ApiResponseBody<T>

  if (!response.ok) {
    const message = body.error?.message
    const subErrors = body.error?.subErrors

    if (subErrors?.length) {
      throw new Error(subErrors.join(", "))
    }

    throw new Error(message ?? "Something went wrong. Please try again.")
  }

  if (body.data === undefined) {
    throw new Error("Invalid response from server")
  }

  return body.data
}

type RawUser = {
  id: string
  name: string
  email: string
  verified?: boolean
  isVerified?: boolean
  active?: boolean
  createdAt?: string
  updatedAt?: string
}

export function sanitizeUser(raw: RawUser): AppUser {
  return {
    id: raw.id,
    name: raw.name,
    email: raw.email,
    verified: raw.verified ?? raw.isVerified ?? false,
    active: raw.active ?? true,
    createdAt: raw.createdAt,
    updatedAt: raw.updatedAt,
  }
}

export async function loginRequest(credentials: {
  email: string
  password: string
}): Promise<AuthResponse | null> {
  try {
    const response = await fetch(`${getApiBaseUrl()}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    })

    if (!response.ok) {
      return null
    }

    return parseApiResponse<AuthResponse>(response)
  } catch {
    return null
  }
}

export async function registerUser(data: SignupRequest): Promise<void> {
  const response = await fetch(`${getApiBaseUrl()}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error(await parseErrorMessage(response))
  }
}

export async function fetchCurrentUser(accessToken: string): Promise<AppUser> {
  const response = await fetch(`${getApiBaseUrl()}/users/me`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  })

  if (!response.ok) {
    throw new Error(await parseErrorMessage(response))
  }

  const raw = await parseApiResponse<RawUser>(response)
  return sanitizeUser(raw)
}
