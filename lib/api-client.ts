import type {
  ActionResult,
  ApiError,
  ApiResponseBody,
  Bot,
  BotApiKey,
  BotDocument,
  BotDocumentContent,
  ChatResponse,
  CreateApiKeyRequest,
  CreateApiKeyResponse,
  CreateBotRequest,
  CreateWorkspaceRequest,
  UpdateBotRequest,
  Workspace,
} from "@/types/types"

const DEFAULT_ERROR: ApiError = {
  status: 500,
  message: "Something went wrong. Please try again.",
}

async function parseResponseBody<T>(
  response: Response,
): Promise<ApiResponseBody<T>> {
  if (response.status === 204) {
    return { data: undefined as T }
  }

  try {
    return (await response.json()) as ApiResponseBody<T>
  } catch {
    return {}
  }
}

async function clientFetch<T>(
  path: string,
  init?: RequestInit,
): Promise<ActionResult<T>> {
  try {
    const headers = new Headers(init?.headers)

    if (
      init?.body &&
      !(init.body instanceof FormData) &&
      !headers.has("Content-Type")
    ) {
      headers.set("Content-Type", "application/json")
    }

    const response = await fetch(path, {
      ...init,
      headers,
    })

    const body = await parseResponseBody<T>(response)

    if (!response.ok) {
      return {
        success: false,
        error: {
          status: response.status,
          message: body.error?.message ?? DEFAULT_ERROR.message,
          subErrors: body.error?.subErrors,
        },
      }
    }

    return { success: true, data: body.data as T }
  } catch {
    return { success: false, error: DEFAULT_ERROR }
  }
}

export function createWorkspace(data: CreateWorkspaceRequest) {
  return clientFetch<Workspace>("/api/workspaces", {
    method: "POST",
    body: JSON.stringify(data),
  })
}

export function createBot(workspaceId: string, data: CreateBotRequest) {
  return clientFetch<Bot>(`/api/workspaces/${workspaceId}/bots`, {
    method: "POST",
    body: JSON.stringify(data),
  })
}

export function updateBot(botId: string, data: UpdateBotRequest) {
  return clientFetch<Bot>(`/api/bots/${botId}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  })
}

export function sendPlaygroundChat(botId: string, message: string) {
  return clientFetch<ChatResponse>(`/api/bots/${botId}/playground/chat`, {
    method: "POST",
    body: JSON.stringify(message),
  })
}

export async function sendAgentChat(
  message: string,
): Promise<ActionResult<string>> {
  const result = await clientFetch<ChatResponse>("/api/agent/chat", {
    method: "POST",
    body: JSON.stringify(message),
  })

  if (!result.success) {
    return result
  }

  return { success: true, data: result.data.response }
}

export function uploadBotDocument(botId: string, formData: FormData) {
  return clientFetch<BotDocument>(`/api/bots/${botId}/documents`, {
    method: "POST",
    body: formData,
  })
}

export function getBotDocuments(botId: string) {
  return clientFetch<BotDocument[]>(`/api/bots/${botId}/documents`)
}

export function getBotDocument(botId: string, documentId: string) {
  return clientFetch<BotDocumentContent>(
    `/api/bots/${botId}/documents/${documentId}`,
  )
}

export function deleteBotDocument(botId: string, documentId: string) {
  return clientFetch<void>(`/api/bots/${botId}/documents/${documentId}`, {
    method: "DELETE",
  })
}

export function getBotApiKeys(botId: string) {
  return clientFetch<BotApiKey[]>(`/api/bots/${botId}/api-keys`)
}

export function createBotApiKey(botId: string, data: CreateApiKeyRequest) {
  return clientFetch<CreateApiKeyResponse>(`/api/bots/${botId}/api-keys`, {
    method: "POST",
    body: JSON.stringify(data),
  })
}

export function deleteBotApiKey(botId: string, apiKeyId: string) {
  return clientFetch<void>(`/api/bots/${botId}/api-keys/${apiKeyId}`, {
    method: "DELETE",
  })
}
