"use client"

import Link from "next/link"
import { CheckCircle2Icon } from "lucide-react"

import { Button } from "@/components/ui/button"

type PlaygroundStepProps = {
  workspaceId: string
  botName: string
}

const PlaygroundStep = ({ workspaceId, botName }: PlaygroundStepProps) => {
  return (
    <div className="flex h-full flex-col">
      <div className="mb-6">
        <h2 className="font-heading text-lg font-medium">Playground</h2>
        <p className="text-xs text-muted-foreground">
          Test your bot before embedding it on your site.
        </p>
      </div>

      <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-4 rounded-xl p-8 text-center">
        <CheckCircle2Icon className="size-10 text-primary" />
        <div className="space-y-1">
          <p className="font-medium">
            {botName.trim() ? `${botName} is ready!` : "Your bot is ready!"}
          </p>
          <p className="text-xs text-muted-foreground">
            Use the chat preview on the right to try a sample conversation.
          </p>
        </div>
      </div>

      <div className="mt-6 flex justify-end pt-4">
        <Button asChild>
          <Link href={`/${workspaceId}`}>Back to workspace</Link>
        </Button>
      </div>
    </div>
  )
}

export default PlaygroundStep
