"use server"

import { auth, unstable_update } from "@/auth"
import {
  ApiRequestError,
  sendAgentChatRequest,
  withTokenRefresh,
} from "@/lib/api"
import type { ActionResult, ApiError, AuthResponse, ChatResponse } from "@/types/types"

async function persistRefreshedTokens(tokens: AuthResponse) {
  await unstable_update({
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
  })
}

async function withSessionTokens<T>(
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

function toActionError(error: unknown): ApiError {
  if (error instanceof ApiRequestError) {
    return error.apiError
  }

  return {
    status: 500,
    message: "Something went wrong. Please try again.",
  }
}

export async function sendAgentChat(
  message: string,
): Promise<ActionResult<string>> {
  const trimmedMessage = message.trim()

  if (!trimmedMessage) {
    return {
      success: false,
      error: {
        status: 400,
        message: "Message cannot be empty.",
      },
    }
  }

  try {
    const response = await withSessionTokens((accessToken) =>
      sendAgentChatRequest(accessToken, trimmedMessage),
    )

    return { success: true, data: response.response }
  } catch (error) {
    return { success: false, error: toActionError(error) }
  }
}
