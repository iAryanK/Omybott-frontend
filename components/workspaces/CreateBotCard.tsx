import Link from "next/link"
import { PlusIcon } from "lucide-react"

import { cn } from "@/lib/utils"

type CreateBotCardProps = {
  workspaceId: string
}

const CreateBotCard = ({ workspaceId }: CreateBotCardProps) => {
  return (
    <Link
      href={`/${workspaceId}/create-bot`}
      className={cn(
        "flex w-72 shrink-0 flex-col items-center justify-center gap-2 rounded-xl bg-card ring-1 ring-foreground/10",
        "aspect-[1.586/1] border border-dashed border-border/80 shadow-sm transition-colors",
        "text-muted-foreground hover:border-primary/40 hover:bg-muted/30",
      )}
    >
      <div className="flex size-10 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <PlusIcon className="size-5" />
      </div>
      <span className="text-xs font-medium text-muted-foreground">Create bot</span>
    </Link>
  )
}

export default CreateBotCard
