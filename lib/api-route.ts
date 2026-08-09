import { auth, unstable_update } from "@/auth"
import { ApiRequestError, withTokenRefresh } from "@/lib/api"
import type { ApiError, ApiResponseBody, AuthResponse } from "@/types/types"

async function persistRefreshedTokens(tokens: AuthResponse) {
  await unstable_update({
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
  })
}

export async function withSessionTokens<T>(
  requestFn: (accessToken: string) => Promise<T>,
): Promise<T> {
  const session = await auth()

  if (!session?.accessToken || !session.refreshToken) {
    throw new ApiRequestError({
      status: 401,
      message: "Unauthorized",
    })
  }

  return withTokenRefresh(
    {
      accessToken: session.accessToken,
      refreshToken: session.refreshToken,
    },
    requestFn,
    persistRefreshedTokens,
  )
}

export function toApiError(error: unknown): ApiError {
  if (error instanceof ApiRequestError) {
    return error.apiError
  }

  return {
    status: 500,
    message: "Something went wrong. Please try again.",
  }
}

export function jsonData<T>(data: T, status = 200): Response {
  const body: ApiResponseBody<T> = { data }
  return Response.json(body, { status })
}

export function jsonError(error: ApiError): Response {
  const status = error.status && error.status >= 400 ? error.status : 500
  const body: ApiResponseBody<never> = { error }
  return Response.json(body, { status })
}

export function handleRouteError(error: unknown): Response {
  return jsonError(toApiError(error))
}
