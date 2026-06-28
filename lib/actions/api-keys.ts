"use server"

import { auth, unstable_update } from "@/auth"
import {
  ApiRequestError,
  createBotApiKeyRequest,
  deleteBotApiKeyRequest,
  fetchBotApiKeysRequest,
  withTokenRefresh,
} from "@/lib/api"
import type {
  ActionResult,
  ApiError,
  AuthResponse,
  BotApiKey,
  CreateApiKeyRequest,
  CreateApiKeyResponse,
} from "@/types/types"

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

function assertBotId(botId: string): ApiError | null {
  if (!botId || botId === "undefined") {
    return { status: 400, message: "Bot ID is missing." }
  }

  return null
}

export async function getBotApiKeys(
  botId: string,
): Promise<ActionResult<BotApiKey[]>> {
  const botIdError = assertBotId(botId)
  if (botIdError) {
    return { success: false, error: botIdError }
  }

  try {
    const apiKeys = await withSessionTokens((accessToken) =>
      fetchBotApiKeysRequest(accessToken, botId),
    )

    return { success: true, data: apiKeys }
  } catch (error) {
    return { success: false, error: toActionError(error) }
  }
}

export async function createBotApiKey(
  botId: string,
  data: CreateApiKeyRequest,
): Promise<ActionResult<CreateApiKeyResponse>> {
  const botIdError = assertBotId(botId)
  if (botIdError) {
    return { success: false, error: botIdError }
  }

  const name = data.name.trim()
  if (!name) {
    return {
      success: false,
      error: { status: 400, message: "API key name is required." },
    }
  }

  try {
    const apiKey = await withSessionTokens((accessToken) =>
      createBotApiKeyRequest(accessToken, botId, { name }),
    )

    return { success: true, data: apiKey }
  } catch (error) {
    return { success: false, error: toActionError(error) }
  }
}

export async function deleteBotApiKey(
  botId: string,
  apiKeyId: string,
): Promise<ActionResult<void>> {
  const botIdError = assertBotId(botId)
  if (botIdError) {
    return { success: false, error: botIdError }
  }

  if (!apiKeyId) {
    return {
      success: false,
      error: { status: 400, message: "API key ID is missing." },
    }
  }

  try {
    await withSessionTokens((accessToken) =>
      deleteBotApiKeyRequest(accessToken, botId, apiKeyId),
    )

    return { success: true, data: undefined }
  } catch (error) {
    return { success: false, error: toActionError(error) }
  }
}
