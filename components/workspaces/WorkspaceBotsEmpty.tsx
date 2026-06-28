import Link from "next/link"
import { PlusIcon, SmilePlusIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"

type WorkspaceBotsEmptyProps = {
  workspaceId: string
}

const WorkspaceBotsEmpty = ({ workspaceId }: WorkspaceBotsEmptyProps) => {
  return (
    <Empty className="min-h-0 flex-1">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <SmilePlusIcon />
        </EmptyMedia>
        <EmptyTitle>Create your first bot</EmptyTitle>
        <EmptyDescription>
          You can add as many bots to this workspace as you want.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button asChild>
          <Link href={`/${workspaceId}/create-bot`}>
            <PlusIcon data-icon="inline-start" />
            Create your first bot
          </Link>
        </Button>
      </EmptyContent>
    </Empty>
  )
}

export default WorkspaceBotsEmpty
