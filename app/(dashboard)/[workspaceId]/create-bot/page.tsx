type CreateBotPageProps = {
  params: Promise<{
    workspaceId: string
  }>
}

const CreateBotPage = async ({ params }: CreateBotPageProps) => {
  const { workspaceId } = await params

  return null
}

export default CreateBotPage
