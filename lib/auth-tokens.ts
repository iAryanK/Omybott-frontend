export function getTokenExpiryMs(token: string): number | null {
  try {
    const payload = JSON.parse(atob(token.split(".")[1] ?? "")) as {
      exp?: number
    }
    return payload.exp ? payload.exp * 1000 : null
  } catch {
    return null
  }
}

export function isAccessTokenExpired(
  accessToken: string,
  bufferMs = 30_000,
): boolean {
  const expiryMs = getTokenExpiryMs(accessToken)
  if (!expiryMs) {
    return true
  }

  return Date.now() >= expiryMs - bufferMs
}
