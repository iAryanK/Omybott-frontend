import Link from "next/link"
import { ArrowLeftIcon } from "lucide-react"

import CreateBotFlow from "@/components/bots/create-bot/CreateBotFlow"
import { Button } from "@/components/ui/button"

type CreateBotPageProps = {
  params: Promise<{
    workspaceId: string
  }>
}

const CreateBotPage = async ({ params }: CreateBotPageProps) => {
  const { workspaceId } = await params

  return (
    <div className="flex min-h-0 flex-1 flex-col p-4">
      <div className="mb-2 flex items-center gap-3">
        <div>
          <h1 className="font-heading text-lg font-medium">Create bot</h1>
          <p className="text-xs text-muted-foreground">
            Configure, train, and preview your new bot.
          </p>
        </div>
      </div>
      <CreateBotFlow workspaceId={workspaceId} />
    </div>
  )
}

export default CreateBotPage
