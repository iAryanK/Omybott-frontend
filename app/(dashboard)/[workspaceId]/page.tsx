import WorkspaceBots from "@/components/workspaces/WorkspaceBots"
import WorkspaceDetails from "@/components/workspaces/WorkspaceDetails"
import { getWorkspace, getWorkspaceBots } from "@/lib/actions/workspaces"

type WorkspacePageProps = {
  params: Promise<{
    workspaceId: string
  }>
}

const WorkspacePage = async ({ params }: WorkspacePageProps) => {
  const { workspaceId } = await params
  const [workspace, bots] = await Promise.all([
    getWorkspace(workspaceId),
    getWorkspaceBots(workspaceId),
  ])

  return (
    <div className="flex min-h-0 flex-1 flex-col p-4">
      <WorkspaceDetails workspace={workspace} />
      <WorkspaceBots bots={bots} workspaceId={workspaceId} />
    </div>
  )
}

export default WorkspacePage
