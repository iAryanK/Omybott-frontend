import { deleteBotApiKeyRequest } from "@/lib/api"
import {
  handleRouteError,
  jsonData,
  jsonError,
  withSessionTokens,
} from "@/lib/api-route"

type RouteContext = {
  params: Promise<{ botId: string; apiKeyId: string }>
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const { botId, apiKeyId } = await context.params

    if (!botId || botId === "undefined") {
      return jsonError({ status: 400, message: "Bot ID is missing." })
    }

    if (!apiKeyId) {
      return jsonError({ status: 400, message: "API key ID is missing." })
    }

    await withSessionTokens((accessToken) =>
      deleteBotApiKeyRequest(accessToken, botId, apiKeyId),
    )

    return jsonData(null)
  } catch (error) {
    return handleRouteError(error)
  }
}
