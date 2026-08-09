import { createBotRequest, fetchWorkspaceBots } from "@/lib/api"
import {
  handleRouteError,
  jsonData,
  jsonError,
  withSessionTokens,
} from "@/lib/api-route"
import type { CreateBotRequest } from "@/types/types"

type RouteContext = {
  params: Promise<{ workspaceId: string }>
}

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { workspaceId } = await context.params
    const bots = await withSessionTokens((accessToken) =>
      fetchWorkspaceBots(accessToken, workspaceId),
    )
    return jsonData(bots)
  } catch (error) {
    return handleRouteError(error)
  }
}

export async function POST(request: Request, context: RouteContext) {
  try {
    const { workspaceId } = await context.params
    const data = (await request.json()) as CreateBotRequest

    if (!data.name?.trim()) {
      return jsonError({ status: 400, message: "Bot name is required." })
    }

    const bot = await withSessionTokens((accessToken) =>
      createBotRequest(accessToken, workspaceId, data),
    )

    return jsonData(bot, 201)
  } catch (error) {
    return handleRouteError(error)
  }
}
