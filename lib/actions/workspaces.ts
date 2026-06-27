"use server"

import { auth } from "@/auth"
import { createWorkspaceRequest, fetchWorkspaces } from "@/lib/api"
import type { CreateWorkspaceRequest, Workspace } from "@/types/types"

export async function getWorkspaces(): Promise<Workspace[]> {
  const session = await auth()

  if (!session?.accessToken) {
    throw new Error("Unauthorized")
  }

  return fetchWorkspaces(session.accessToken)
}

export async function createWorkspace(
  data: CreateWorkspaceRequest,
): Promise<Workspace> {
  const session = await auth()

  if (!session?.accessToken) {
    throw new Error("Unauthorized")
  }

  return createWorkspaceRequest(session.accessToken, data)
}
