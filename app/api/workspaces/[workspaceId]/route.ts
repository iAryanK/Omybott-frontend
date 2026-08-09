import { fetchWorkspace } from "@/lib/api"
import {
  handleRouteError,
  jsonData,
  withSessionTokens,
} from "@/lib/api-route"

type RouteContext = {
  params: Promise<{ workspaceId: string }>
}

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { workspaceId } = await context.params
    const workspace = await withSessionTokens((accessToken) =>
      fetchWorkspace(accessToken, workspaceId),
    )
    return jsonData(workspace)
  } catch (error) {
    return handleRouteError(error)
  }
}
