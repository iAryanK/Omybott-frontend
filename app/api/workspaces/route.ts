import {
  createWorkspaceRequest,
  fetchWorkspaces,
} from "@/lib/api"
import {
  handleRouteError,
  jsonData,
  jsonError,
  withSessionTokens,
} from "@/lib/api-route"
import type { CreateWorkspaceRequest } from "@/types/types"

export async function GET() {
  try {
    const workspaces = await withSessionTokens(fetchWorkspaces)
    return jsonData(workspaces)
  } catch (error) {
    return handleRouteError(error)
  }
}

export async function POST(request: Request) {
  try {
    const data = (await request.json()) as CreateWorkspaceRequest

    if (!data.name?.trim()) {
      return jsonError({ status: 400, message: "Workspace name is required." })
    }

    const workspace = await withSessionTokens((accessToken) =>
      createWorkspaceRequest(accessToken, data),
    )

    return jsonData(workspace, 201)
  } catch (error) {
    return handleRouteError(error)
  }
}
