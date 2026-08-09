import { getWorkspaces } from "@/lib/server-api"
import CreateWorkspaceDialog from "@/components/workspaces/CreateWorkspaceDialog"
import Link from "next/link"
import { PlusIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { getIconColor, getInitial } from "@/utils/util"

const HomePage = async () => {
  const workspaces = await getWorkspaces()

  return (
    <div className="flex h-[80vh] flex-col items-center justify-center gap-6 p-6">
      <h1 className="font-heading text-lg font-medium">Workspaces</h1>

      <div className="flex max-w-92 flex-wrap justify-center gap-x-3 gap-y-5">
        {workspaces.map((workspace) => (
          <Link
            key={workspace.id}
            href={`/${workspace.id}`}
            className={cn(
              "group flex w-16 flex-col items-center gap-1.5 text-center",
              !workspace.active && "opacity-50",
            )}
          >
            <div
              className={cn(
                "flex size-14 items-center justify-center rounded-xl bg-linear-to-br text-lg font-semibold text-white shadow-md transition-transform group-hover:scale-105",
                getIconColor(workspace.name),
              )}
            >
              {getInitial(workspace.name)}
            </div>
            <span className="line-clamp-2 w-full text-[0.65rem] leading-tight text-foreground">
              {workspace.name}
            </span>
          </Link>
        ))}

        <CreateWorkspaceDialog>
          <button
            type="button"
            className="group flex w-16 flex-col items-center gap-1.5 text-center"
          >
            <div className="flex size-14 items-center justify-center rounded-xl bg-muted text-muted-foreground shadow-md transition-transform group-hover:scale-105">
              <PlusIcon className="size-6" />
            </div>
            <span className="line-clamp-2 w-full text-[0.65rem] leading-tight text-foreground">
              Create
            </span>
          </button>
        </CreateWorkspaceDialog>
      </div>
    </div>
  )
}

export default HomePage
