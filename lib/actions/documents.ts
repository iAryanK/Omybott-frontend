"use server"

import { auth, unstable_update } from "@/auth"
import {
  ApiRequestError,
  uploadBotDocumentRequest,
  withTokenRefresh,
} from "@/lib/api"
import type { ActionResult, ApiError, AuthResponse, BotDocument } from "@/types/types"

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

export async function uploadBotDocument(
  botId: string,
  formData: FormData,
): Promise<ActionResult<BotDocument>> {
  if (!botId || botId === "undefined") {
    return {
      success: false,
      error: {
        status: 400,
        message: "Bot ID is missing. Go back and create the bot again.",
      },
    }
  }

  const file = formData.get("file")

  if (!(file instanceof File) || file.size === 0) {
    return {
      success: false,
      error: { status: 400, message: "No file provided" },
    }
  }

  try {
    const document = await withSessionTokens((accessToken) =>
      uploadBotDocumentRequest(accessToken, botId, file),
    )

    return { success: true, data: document }
  } catch (error) {
    return { success: false, error: toActionError(error) }
  }
}
