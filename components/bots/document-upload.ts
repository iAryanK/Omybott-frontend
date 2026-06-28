export const ACCEPTED_FILE_TYPES = ".pdf,.txt,.md,.markdown"

export const ACCEPTED_MIME_TYPES = [
  "application/pdf",
  "text/plain",
  "text/markdown",
  "text/x-markdown",
]

export function formatFileSize(bytes: number) {
  if (bytes < 1024) {
    return `${bytes} B`
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function isAcceptedFile(file: File) {
  if (ACCEPTED_MIME_TYPES.includes(file.type)) {
    return true
  }

  const lowerName = file.name.toLowerCase()
  return (
    lowerName.endsWith(".pdf") ||
    lowerName.endsWith(".txt") ||
    lowerName.endsWith(".md") ||
    lowerName.endsWith(".markdown")
  )
}
