import { Badge } from "@/components/ui/badge"
import type { Bot } from "@/types/types"
import { getInitial } from "@/utils/util"

type BotDetailsProps = {
  bot: Bot
}

function formatDate(value?: string) {
  if (!value) return "—"

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value))
}

const BotDetails = ({ bot }: BotDetailsProps) => {
  return (
    <header className="w-full border-l-2 border-l-primary bg-muted/80">
      <div className="flex flex-col gap-4 px-4 py-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-4">
          <div
            className="relative flex size-12 shrink-0 items-center justify-center rounded-xl text-base font-semibold text-white shadow-sm"
            style={{ backgroundColor: bot.primaryColor }}
          >
            {getInitial(bot.name)}
          </div>

          <div className="min-w-0 space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="truncate font-heading text-lg font-medium text-foreground">
                {bot.name}
              </h1>
              <Badge variant={bot.status === "ACTIVE" ? "default" : "secondary"}>
                BOT
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">{bot.slug}</p>
          </div>
        </div>

        <div className="flex flex-col flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground sm:justify-end">
          <div className="flex items-center gap-2">
            <span className="font-medium text-foreground/70">Created</span>
            <span>{formatDate(bot.createdAt)}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-medium text-foreground/70">Updated</span>
            <span>{formatDate(bot.updatedAt)}</span>
          </div>
        </div>
      </div>
    </header>
  )
}

export default BotDetails
