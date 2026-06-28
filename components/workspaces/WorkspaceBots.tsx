import BotCard from "@/components/workspaces/BotCard"
import WorkspaceBotsEmpty from "@/components/workspaces/WorkspaceBotsEmpty"
import type { Bot } from "@/types/types"

type WorkspaceBotsProps = {
  workspaceId: string
  bots: Bot[]
}

const WorkspaceBots = ({ workspaceId, bots }: WorkspaceBotsProps) => {
  if (bots.length === 0) {
    return (
      <section className="flex min-h-0 w-full flex-1 flex-col py-5">
        <WorkspaceBotsEmpty workspaceId={workspaceId} />
      </section>
    )
  }

  return (
    <section className="w-full py-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-heading text-sm font-medium text-foreground">Bots</h2>
        <span className="text-xs text-muted-foreground">
          {bots.length} {bots.length === 1 ? "bot" : "bots"}
        </span>
      </div>

      <div className="flex flex-wrap gap-4">
        {bots.map((bot) => (
          <BotCard key={bot.id} bot={bot} />
        ))}
      </div>
    </section>
  )
}

export default WorkspaceBots
