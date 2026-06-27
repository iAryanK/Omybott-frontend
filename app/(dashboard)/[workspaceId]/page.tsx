type WorkspacePageProps = {
  params: Promise<{
    workspaceId: string
  }>
}

const WorkspacePage = async ({ params }: WorkspacePageProps) => {
  const { workspaceId } = await params

  return (
    <div className="flex h-full items-center justify-center p-6">
      <p className="text-sm text-muted-foreground">Workspace {workspaceId}</p>
    </div>
  )
}

export default WorkspacePage
