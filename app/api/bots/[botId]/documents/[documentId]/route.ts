import {
  deleteBotDocumentRequest,
  fetchBotDocumentRequest,
} from "@/lib/api"
import {
  handleRouteError,
  jsonData,
  jsonError,
  withSessionTokens,
} from "@/lib/api-route"

type RouteContext = {
  params: Promise<{ botId: string; documentId: string }>
}

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { botId, documentId } = await context.params

    if (!botId || botId === "undefined") {
      return jsonError({ status: 400, message: "Bot ID is missing." })
    }

    if (!documentId) {
      return jsonError({ status: 400, message: "Document ID is missing." })
    }

    const document = await withSessionTokens((accessToken) =>
      fetchBotDocumentRequest(accessToken, botId, documentId),
    )

    return jsonData(document)
  } catch (error) {
    return handleRouteError(error)
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const { botId, documentId } = await context.params

    if (!botId || botId === "undefined") {
      return jsonError({ status: 400, message: "Bot ID is missing." })
    }

    if (!documentId) {
      return jsonError({ status: 400, message: "Document ID is missing." })
    }

    await withSessionTokens((accessToken) =>
      deleteBotDocumentRequest(accessToken, botId, documentId),
    )

    return jsonData(null)
  } catch (error) {
    return handleRouteError(error)
  }
}
