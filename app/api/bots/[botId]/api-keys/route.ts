import {
  createBotApiKeyRequest,
  fetchBotApiKeysRequest,
} from "@/lib/api"
import {
  handleRouteError,
  jsonData,
  jsonError,
  withSessionTokens,
} from "@/lib/api-route"
import type { CreateApiKeyRequest } from "@/types/types"

type RouteContext = {
  params: Promise<{ botId: string }>
}

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { botId } = await context.params

    if (!botId || botId === "undefined") {
      return jsonError({ status: 400, message: "Bot ID is missing." })
    }

    const apiKeys = await withSessionTokens((accessToken) =>
      fetchBotApiKeysRequest(accessToken, botId),
    )

    return jsonData(apiKeys)
  } catch (error) {
    return handleRouteError(error)
  }
}

export async function POST(request: Request, context: RouteContext) {
  try {
    const { botId } = await context.params

    if (!botId || botId === "undefined") {
      return jsonError({ status: 400, message: "Bot ID is missing." })
    }

    const data = (await request.json()) as CreateApiKeyRequest
    const name = data.name?.trim()

    if (!name) {
      return jsonError({ status: 400, message: "API key name is required." })
    }

    const apiKey = await withSessionTokens((accessToken) =>
      createBotApiKeyRequest(accessToken, botId, { name }),
    )

    return jsonData(apiKey, 201)
  } catch (error) {
    return handleRouteError(error)
  }
}
