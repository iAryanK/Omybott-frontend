import {
  fetchBotDocumentsRequest,
  uploadBotDocumentRequest,
} from "@/lib/api"
import {
  handleRouteError,
  jsonData,
  jsonError,
  withSessionTokens,
} from "@/lib/api-route"

type RouteContext = {
  params: Promise<{ botId: string }>
}

export async function GET(request: Request, context: RouteContext) {
  try {
    const { botId } = await context.params

    if (!botId || botId === "undefined") {
      return jsonError({ status: 400, message: "Bot ID is missing." })
    }

    const succeededParam = new URL(request.url).searchParams.get("succeeded")
    const succeeded = succeededParam !== "false"

    const documents = await withSessionTokens((accessToken) =>
      fetchBotDocumentsRequest(accessToken, botId, succeeded),
    )

    return jsonData(documents)
  } catch (error) {
    return handleRouteError(error)
  }
}

export async function POST(request: Request, context: RouteContext) {
  try {
    const { botId } = await context.params

    if (!botId || botId === "undefined") {
      return jsonError({
        status: 400,
        message: "Bot ID is missing. Go back and create the bot again.",
      })
    }

    const formData = await request.formData()
    const file = formData.get("file")

    if (!(file instanceof File) || file.size === 0) {
      return jsonError({ status: 400, message: "No file provided" })
    }

    const document = await withSessionTokens((accessToken) =>
      uploadBotDocumentRequest(accessToken, botId, file),
    )

    return jsonData(document, 201)
  } catch (error) {
    return handleRouteError(error)
  }
}
