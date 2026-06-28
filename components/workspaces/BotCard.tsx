import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { Bot } from "@/types/types"
import { getInitial } from "@/utils/util"

type BotCardProps = {
  bot: Bot
}

function truncateId(id: string) {
  return `${id.slice(0, 8)}…${id.slice(-4)}`
}

const BotCard = ({ bot }: BotCardProps) => {
  const domains = bot.allowedDomains ?? []

  return (
    <article
      className={cn(
        "flex w-72 shrink-0 flex-col overflow-hidden rounded-xl bg-card ring-1 ring-foreground/10",
        "aspect-[1.586/1] shadow-sm transition-shadow hover:shadow-md",
        bot.status === "INACTIVE" && "opacity-70",
      )}
    >
      <div className="h-2 shrink-0" style={{ backgroundColor: bot.primaryColor }} />

      <div className="flex min-h-0 flex-1 flex-col gap-2.5 p-3.5">
        <div className="flex items-start gap-2.5">
          <div
            className="flex size-9 shrink-0 items-center justify-center rounded-lg text-sm font-semibold text-white"
            style={{ backgroundColor: bot.primaryColor }}
          >
            {getInitial(bot.name)}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <h3 className="truncate font-heading text-sm font-medium leading-tight">
                {bot.name}
              </h3>
              <Badge
                variant={bot.status === "ACTIVE" ? "default" : "secondary"}
                className="shrink-0"
              >
                {bot.status}
              </Badge>
            </div>
            <p className="truncate text-[0.65rem] text-muted-foreground">
              {bot.slug}
            </p>
          </div>
        </div>

        <p className="line-clamp-2 min-h-8 text-[0.65rem] leading-relaxed text-muted-foreground">
          {bot.description?.trim() || "No description"}
        </p>

        <div className="mt-auto space-y-1.5 border-t border-border/60 pt-2 text-[0.6rem]">
          <div className="flex items-center justify-between gap-2">
            <span className="text-muted-foreground">ID</span>
            <span className="truncate font-mono text-foreground" title={bot.id}>
              {truncateId(bot.id)}
            </span>
          </div>

          <div className="flex items-center justify-between gap-2">
            <span className="shrink-0 text-muted-foreground">Color</span>
            <div className="flex items-center gap-1.5">
              <span
                className="size-3 rounded-full ring-1 ring-foreground/10"
                style={{ backgroundColor: bot.primaryColor }}
              />
              <span className="truncate font-mono uppercase text-foreground">
                {bot.primaryColor}
              </span>
            </div>
          </div>

          <div className="flex items-start justify-between gap-2">
            <span className="shrink-0 text-muted-foreground">Domains</span>
            <span className="line-clamp-2 text-right text-foreground">
              {domains.length > 0 ? domains.join(", ") : "—"}
            </span>
          </div>
        </div>
      </div>
    </article>
  )
}

export default BotCard
