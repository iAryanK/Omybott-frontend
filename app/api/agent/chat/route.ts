import { sendAgentChatRequest } from "@/lib/api"
import {
  handleRouteError,
  jsonData,
  jsonError,
  withSessionTokens,
} from "@/lib/api-route"

export async function POST(request: Request) {
  try {
    const message = (await request.json()) as string
    const trimmedMessage = typeof message === "string" ? message.trim() : ""

    if (!trimmedMessage) {
      return jsonError({ status: 400, message: "Message cannot be empty." })
    }

    const response = await withSessionTokens((accessToken) =>
      sendAgentChatRequest(accessToken, trimmedMessage),
    )

    return jsonData(response)
  } catch (error) {
    return handleRouteError(error)
  }
}
