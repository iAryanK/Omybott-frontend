const DATE_TIME_FORMAT = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
  timeStyle: "short",
})

function parseDateString(value: string): Date | null {
  // 1. Standard Date parsing (ISO 8601, etc.)
  const directDate = new Date(value)
  if (!isNaN(directDate.getTime())) {
    return directDate
  }

  const trimmed = value.trim()

  // 2. "HH:mm:ss DD-MM-YYYY" or "HH:mm:ss DD/MM/YYYY" (e.g. "07:03:20 16-08-2026")
  const timeDateMatch = trimmed.match(
    /^(\d{1,2}):(\d{2})(?::(\d{2}))?\s+(\d{1,2})[-/](\d{1,2})[-/](\d{4})$/,
  )
  if (timeDateMatch) {
    const [, hours, minutes, seconds = "0", day, month, year] = timeDateMatch
    const date = new Date(
      Number(year),
      Number(month) - 1,
      Number(day),
      Number(hours),
      Number(minutes),
      Number(seconds),
    )
    if (!isNaN(date.getTime())) return date
  }

  return null
}

export function formatDateTime(value?: string | null, emptyLabel = "—") {
  if (!value) return emptyLabel

  const date = parseDateString(value)
  if (!date) return emptyLabel

  return DATE_TIME_FORMAT.format(date)
}
