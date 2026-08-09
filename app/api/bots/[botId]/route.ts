import { fetchBot, patchBotRequest } from "@/lib/api"
import {
  handleRouteError,
  jsonData,
  withSessionTokens,
} from "@/lib/api-route"
import type { UpdateBotRequest } from "@/types/types"

type RouteContext = {
  params: Promise<{ botId: string }>
}

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { botId } = await context.params
    const bot = await withSessionTokens((accessToken) =>
      fetchBot(accessToken, botId),
    )
    return jsonData(bot)
  } catch (error) {
    return handleRouteError(error)
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const { botId } = await context.params
    const data = (await request.json()) as UpdateBotRequest
    const bot = await withSessionTokens((accessToken) =>
      patchBotRequest(accessToken, botId, data),
    )
    return jsonData(bot)
  } catch (error) {
    return handleRouteError(error)
  }
}
