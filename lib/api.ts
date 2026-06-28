import type {
  ApiError,
  ApiResponseBody,
  AppUser,
  AuthResponse,
  Bot,
  CreateBotRequest,
  CreateWorkspaceRequest,
  SignupRequest,
  Workspace,
} from "@/types/types"

export function getApiBaseUrl() {
  return process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080"
}

export class ApiRequestError extends Error {
  apiError: ApiError

  constructor(apiError: ApiError) {
    super(apiError.subErrors?.join(", ") ?? apiError.message ?? "Something went wrong. Please try again.")
    this.name = "ApiRequestError"
    this.apiError = apiError
  }
}

export function formatApiError(error: ApiError): string {
  if (error.subErrors?.length) {
    return error.subErrors.join(", ")
  }

  return error.message ?? "Something went wrong. Please try again."
}

async function readApiResponseBody<T>(
  response: Response,
): Promise<ApiResponseBody<T>> {
  return (await response.json()) as ApiResponseBody<T>
}

export async function parseApiError(response: Response): Promise<ApiError> {
  const fallback: ApiError = {
    status: response.status,
    message: "Something went wrong. Please try again.",
  }

  try {
    const body = await readApiResponseBody<unknown>(response)

    return {
      status: response.status,
      message: body.error?.message ?? fallback.message,
      subErrors: body.error?.subErrors,
    }
  } catch {
    return fallback
  }
}

export async function parseErrorMessage(response: Response): Promise<string> {
  return formatApiError(await parseApiError(response))
}

export async function parseApiResponse<T>(response: Response): Promise<T> {
  const body = await readApiResponseBody<T>(response)

  if (!response.ok) {
    throw new ApiRequestError({
      status: response.status,
      message: body.error?.message,
      subErrors: body.error?.subErrors,
    })
  }

  if (body.data === undefined) {
    throw new ApiRequestError({
      status: response.status,
      message: "Invalid response from server",
    })
  }

  return body.data
}

function isUnauthorizedError(error: ApiRequestError): boolean {
  return error.apiError.status === 401
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

export async function refreshTokenRequest(
  refreshToken: string,
): Promise<AuthResponse> {
  const response = await fetch(`${getApiBaseUrl()}/auth/refresh`, {
    method: "POST",
    headers: {
      Cookie: `refreshToken=${refreshToken}`,
    },
  })

  return parseApiResponse<AuthResponse>(response)
}

export async function withTokenRefresh<T>(
  tokens: { accessToken: string; refreshToken: string },
  requestFn: (accessToken: string) => Promise<T>,
  onTokensRefreshed?: (tokens: AuthResponse) => Promise<void>,
): Promise<T> {
  try {
    return await requestFn(tokens.accessToken)
  } catch (error) {
    if (
      !(error instanceof ApiRequestError) ||
      !isUnauthorizedError(error) ||
      !tokens.refreshToken
    ) {
      throw error
    }

    const refreshedTokens = await refreshTokenRequest(tokens.refreshToken)
    await onTokensRefreshed?.(refreshedTokens)

    return requestFn(refreshedTokens.accessToken)
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
    throw new ApiRequestError(await parseApiError(response))
  }
}

export async function fetchCurrentUser(accessToken: string): Promise<AppUser> {
  const response = await fetch(`${getApiBaseUrl()}/users/me`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  })

  if (!response.ok) {
    throw new ApiRequestError(await parseApiError(response))
  }

  const raw = await parseApiResponse<RawUser>(response)
  return sanitizeUser(raw)
}

export async function fetchWorkspaces(accessToken: string): Promise<Workspace[]> {
  const response = await fetch(`${getApiBaseUrl()}/workspaces`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  })

  if (!response.ok) {
    throw new ApiRequestError(await parseApiError(response))
  }

  return parseApiResponse<Workspace[]>(response)
}

export async function fetchWorkspace(
  accessToken: string,
  workspaceId: string,
): Promise<Workspace> {
  const response = await fetch(`${getApiBaseUrl()}/workspaces/${workspaceId}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  })

  if (!response.ok) {
    throw new ApiRequestError(await parseApiError(response))
  }

  return parseApiResponse<Workspace>(response)
}

export async function fetchWorkspaceBots(
  accessToken: string,
  workspaceId: string,
): Promise<Bot[]> {
  const response = await fetch(
    `${getApiBaseUrl()}/workspaces/${workspaceId}/bots`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    },
  )

  if (!response.ok) {
    throw new ApiRequestError(await parseApiError(response))
  }

  return parseApiResponse<Bot[]>(response)
}

export async function createBotRequest(
  accessToken: string,
  workspaceId: string,
  data: CreateBotRequest,
): Promise<Bot> {
  const response = await fetch(
    `${getApiBaseUrl()}/workspaces/${workspaceId}/bots`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        ...data,
        status: data.status ?? "ACTIVE",
      }),
    },
  )

  if (!response.ok) {
    throw new ApiRequestError(await parseApiError(response))
  }

  return parseApiResponse<Bot>(response)
}

export async function createWorkspaceRequest(
  accessToken: string,
  data: CreateWorkspaceRequest,
): Promise<Workspace> {
  const response = await fetch(`${getApiBaseUrl()}/workspaces`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new ApiRequestError(await parseApiError(response))
  }

  return parseApiResponse<Workspace>(response)
}
