const DATE_TIME_FORMAT = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
  timeStyle: "short",
})

export function formatDateTime(value?: string | null, emptyLabel = "—") {
  if (!value) return emptyLabel

  return DATE_TIME_FORMAT.format(new Date(value))
}
