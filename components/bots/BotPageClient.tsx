"use client"

import { useState } from "react"

import BotDetails from "@/components/bots/BotDetails"
import BotTabs from "@/components/bots/BotTabs"
import {
  botToFormData,
  formDataToBot,
  formDataToUpdateRequest,
  type BotFormData,
} from "@/components/bots/bot-form"
import { updateBot } from "@/lib/api-client"
import { formatApiError } from "@/lib/api"
import type { Bot } from "@/types/types"

type BotPageClientProps = {
  bot: Bot
}

const BotPageClient = ({ bot: initialBot }: BotPageClientProps) => {
  const [bot, setBot] = useState(initialBot)
  const [formData, setFormData] = useState<BotFormData>(() =>
    botToFormData(initialBot),
  )
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const displayBot = isEditing ? formDataToBot(bot, formData) : bot

  const handleEdit = () => {
    setFormData(botToFormData(bot))
    setError(null)
    setIsEditing(true)
  }

  const handleCancel = () => {
    setFormData(botToFormData(bot))
    setError(null)
    setIsEditing(false)
  }

  const handleSave = async () => {
    setIsSaving(true)
    setError(null)

    try {
      const result = await updateBot(bot.id, formDataToUpdateRequest(formData))

      if (!result.success) {
        setError(formatApiError(result.error))
        return
      }

      setBot(result.data)
      setFormData(botToFormData(result.data))
      setIsEditing(false)
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "Failed to update bot. Please try again.",
      )
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <div className="shrink-0">
        <BotDetails bot={displayBot} />
      </div>
      <BotTabs
        botId={bot.id}
        formData={formData}
        isEditing={isEditing}
        isSaving={isSaving}
        error={error}
        onChange={setFormData}
        onEdit={handleEdit}
        onCancel={handleCancel}
        onSave={() => void handleSave()}
      />
    </div>
  )
}

export default BotPageClient
