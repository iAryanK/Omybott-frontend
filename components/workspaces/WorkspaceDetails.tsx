import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import type { Workspace } from "@/types/types"
import { getIconColor, getInitial } from "@/utils/util"

type WorkspaceDetailsProps = {
  workspace: Workspace
}

function formatDate(value?: string) {
  if (!value) return "—"

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value))
}

const WorkspaceDetails = ({ workspace }: WorkspaceDetailsProps) => {
  return (
    <header className="w-full border-l-2 border-l-primary bg-muted/80">
      <div className="flex flex-col gap-4 px-4 py-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-4">
          <div
            className={cn(
              "relative flex size-12 shrink-0 items-center justify-center rounded-xl bg-linear-to-br text-base font-semibold text-white shadow-sm",
              getIconColor(workspace.name),
            )}
          >
            {getInitial(workspace.name)}
          </div>

          <div className="min-w-0 space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="truncate font-heading text-lg font-medium text-foreground">
                {workspace.name}
              </h1>
              <Badge variant={workspace.active ? "default" : "secondary"}>
                {workspace.active ? "Active" : "Inactive"}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">{workspace.slug}</p>
          </div>
        </div>

        <div className="flex flex-col flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground sm:justify-end">
          <div className="flex items-center gap-2">
            <span className="font-medium text-foreground/70">Created</span>
            <span>{formatDate(workspace.createdAt)}</span>
          </div>
          {/* <Separator orientation="vertical" className="hidden h-4 sm:block" /> */}
          <div className="flex items-center gap-2">
            <span className="font-medium text-foreground/70">Updated</span>
            <span>{formatDate(workspace.updatedAt)}</span>
          </div>
        </div>
      </div>
    </header>
  )
}

export default WorkspaceDetails
