"use client"

import type { CreateBotFormData } from "@/components/bots/create-bot/types"
import CreateBotChatPreview from "@/components/bots/create-bot/CreateBotChatPreview"
import BotDetailsTab from "@/components/bots/BotDetailsTab"
import type { BotFormData } from "@/components/bots/bot-form"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "../ui/separator"

type BotTabsProps = {
  botId: string
  formData: BotFormData
  isEditing: boolean
  isSaving: boolean
  error: string | null
  onChange: (data: BotFormData) => void
  onEdit: () => void
  onCancel: () => void
  onSave: () => void
}

function toPreviewData(formData: BotFormData): CreateBotFormData {
  return {
    name: formData.name,
    slug: formData.slug,
    description: formData.description,
    primaryColor: formData.primaryColor,
    welcomeMessage: formData.welcomeMessage,
    allowedDomains: formData.allowedDomains,
  }
}

const BotTabs = ({
  botId,
  formData,
  isEditing,
  isSaving,
  error,
  onChange,
  onEdit,
  onCancel,
  onSave,
}: BotTabsProps) => {
  return (
    <div className="mt-4 grid min-h-0 flex-1 gap-10 lg:grid-cols-5">
      <Tabs
        defaultValue="details"
        className="flex min-h-0 flex-col overflow-hidden lg:col-span-3"
      >
        <TabsList className="w-full shrink-0 bg-transparent rounded-none border-b">
          <TabsTrigger value="details" className="w-fit px-8">
            Details
          </TabsTrigger>
          <TabsTrigger value="documents" className="w-fit px-8">
            Documents
          </TabsTrigger>
          <TabsTrigger value="analytics" className="w-fit px-8">
            Analytics
          </TabsTrigger>
        </TabsList>
        <TabsContent
          value="details"
          className="min-h-0 flex-1 overflow-y-auto scrollbar-none"
        >
          <BotDetailsTab
            formData={formData}
            isEditing={isEditing}
            isSaving={isSaving}
            error={error}
            onChange={onChange}
            onEdit={onEdit}
            onCancel={onCancel}
            onSave={onSave}
          />
        </TabsContent>
        <TabsContent
          value="documents"
          className="min-h-0 flex-1 overflow-y-auto"
        />
        <TabsContent
          value="analytics"
          className="min-h-0 flex-1 overflow-y-auto"
        />
      </Tabs>

      <CreateBotChatPreview
        formData={toPreviewData(formData)}
        botId={botId}
        interactive
      />
    </div>
  )
}

export default BotTabs
