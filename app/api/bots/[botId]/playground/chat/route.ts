import { sendPlaygroundChatRequest } from "@/lib/api"
import {
  handleRouteError,
  jsonData,
  jsonError,
  withSessionTokens,
} from "@/lib/api-route"

type RouteContext = {
  params: Promise<{ botId: string }>
}

export async function POST(request: Request, context: RouteContext) {
  try {
    const { botId } = await context.params

    if (!botId || botId === "undefined") {
      return jsonError({ status: 400, message: "Bot ID is missing." })
    }

    const message = (await request.json()) as string
    const trimmedMessage = typeof message === "string" ? message.trim() : ""

    if (!trimmedMessage) {
      return jsonError({ status: 400, message: "Message cannot be empty." })
    }

    const response = await withSessionTokens((accessToken) =>
      sendPlaygroundChatRequest(accessToken, botId, trimmedMessage),
    )

    return jsonData(response)
  } catch (error) {
    return handleRouteError(error)
  }
}
