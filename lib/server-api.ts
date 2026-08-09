import { headers } from "next/headers"

import type { ApiError, ApiResponseBody, Bot, Workspace } from "@/types/types"

const DEFAULT_ERROR: ApiError = {
  status: 500,
  message: "Something went wrong. Please try again.",
}

async function serverFetch<T>(path: string): Promise<T> {
  const headerStore = await headers()
  const host = headerStore.get("x-forwarded-host") ?? headerStore.get("host")
  const protocol = headerStore.get("x-forwarded-proto") ?? "http"

  if (!host) {
    throw new Error("Unable to resolve request host for API call.")
  }

  const cookie = headerStore.get("cookie") ?? ""
  const response = await fetch(`${protocol}://${host}${path}`, {
    headers: { cookie },
    cache: "no-store",
  })

  let body: ApiResponseBody<T> = {}

  try {
    body = (await response.json()) as ApiResponseBody<T>
  } catch {
    // ignore empty/invalid bodies
  }

  if (!response.ok) {
    throw new Error(body.error?.message ?? DEFAULT_ERROR.message)
  }

  return body.data as T
}

export function getWorkspaces() {
  return serverFetch<Workspace[]>("/api/workspaces")
}

export function getWorkspace(workspaceId: string) {
  return serverFetch<Workspace>(`/api/workspaces/${workspaceId}`)
}

export function getWorkspaceBots(workspaceId: string) {
  return serverFetch<Bot[]>(`/api/workspaces/${workspaceId}/bots`)
}

export function getBot(botId: string) {
  return serverFetch<Bot>(`/api/bots/${botId}`)
}
