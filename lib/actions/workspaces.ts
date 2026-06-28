"use server"

import { auth, unstable_update } from "@/auth"
import {
  ApiRequestError,
  createBotRequest,
  createWorkspaceRequest,
  fetchBot,
  fetchWorkspace,
  fetchWorkspaceBots,
  fetchWorkspaces,
  patchBotRequest,
  withTokenRefresh,
} from "@/lib/api"
import type {
  ActionResult,
  ApiError,
  AuthResponse,
  Bot,
  CreateBotRequest,
  CreateWorkspaceRequest,
  UpdateBotRequest,
  Workspace,
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

export async function getWorkspaces(): Promise<Workspace[]> {
  return withSessionTokens(fetchWorkspaces)
}

export async function getWorkspace(workspaceId: string): Promise<Workspace> {
  return withSessionTokens((accessToken) =>
    fetchWorkspace(accessToken, workspaceId),
  )
}

export async function getWorkspaceBots(workspaceId: string): Promise<Bot[]> {
  return withSessionTokens((accessToken) =>
    fetchWorkspaceBots(accessToken, workspaceId),
  )
}

export async function getBot(botId: string): Promise<Bot> {
  return withSessionTokens((accessToken) => fetchBot(accessToken, botId))
}

export async function createWorkspace(
  data: CreateWorkspaceRequest,
): Promise<ActionResult<Workspace>> {
  try {
    const workspace = await withSessionTokens((accessToken) =>
      createWorkspaceRequest(accessToken, data),
    )

    return { success: true, data: workspace }
  } catch (error) {
    return { success: false, error: toActionError(error) }
  }
}

export async function createBot(
  workspaceId: string,
  data: CreateBotRequest,
): Promise<ActionResult<Bot>> {
  try {
    const bot = await withSessionTokens((accessToken) =>
      createBotRequest(accessToken, workspaceId, data),
    )

    return { success: true, data: bot }
  } catch (error) {
    return { success: false, error: toActionError(error) }
  }
}

export async function updateBot(
  botId: string,
  data: UpdateBotRequest,
): Promise<ActionResult<Bot>> {
  try {
    const bot = await withSessionTokens((accessToken) =>
      patchBotRequest(accessToken, botId, data),
    )

    return { success: true, data: bot }
  } catch (error) {
    return { success: false, error: toActionError(error) }
  }
}
