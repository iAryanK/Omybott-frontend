import BotPageClient from "@/components/bots/BotPageClient"
import { getBot } from "@/lib/actions/workspaces"

type BotPageProps = {
  params: Promise<{
    workspaceId: string
    botId: string
  }>
}

const BotPage = async ({ params }: BotPageProps) => {
  const { botId } = await params
  const bot = await getBot(botId)

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden p-4">
      <BotPageClient bot={bot} />
    </div>
  )
}

export default BotPage
