"use client"

import { useState } from "react"

import { createBot } from "@/lib/api-client"
import { formatApiError } from "@/lib/api"
import type { Bot } from "@/types/types"

import CreateBotChatPreview from "./CreateBotChatPreview"
import CreateBotHorizontalTimeline from "./CreateBotHorizontalTimeline"
import BasicInfoStep from "./steps/BasicInfoStep"
import PlaygroundStep from "./steps/PlaygroundStep"
import TrainBotStep from "./steps/TrainBotStep"
import {
  DEFAULT_BOT_FORM,
  type CreateBotFormData,
  type CreateBotStep,
} from "./types"

type CreateBotFlowProps = {
  workspaceId: string
}

const CreateBotFlow = ({ workspaceId }: CreateBotFlowProps) => {
  const [currentStep, setCurrentStep] = useState<CreateBotStep>(1)
  const [formData, setFormData] = useState<CreateBotFormData>(DEFAULT_BOT_FORM)
  const [createdBot, setCreatedBot] = useState<Bot | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [createError, setCreateError] = useState<string | null>(null)

  const handleBasicInfoComplete = async () => {
    setCreateError(null)
    setIsCreating(true)

    try {
      const result = await createBot(workspaceId, {
        name: formData.name.trim(),
        description: formData.description.trim(),
        slug: formData.slug.trim(),
        welcomeMessage: formData.welcomeMessage.trim(),
        primaryColor: formData.primaryColor,
        allowedDomains: formData.allowedDomains,
      })

      if (!result.success) {
        setCreateError(formatApiError(result.error))
        return
      }

      setCreatedBot(result.data)
      setCurrentStep(2)
    } catch (error) {
      setCreateError(
        error instanceof Error
          ? error.message
          : "Failed to create bot. Please try again.",
      )
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <CreateBotHorizontalTimeline currentStep={currentStep} />

      <div className="grid min-h-0 flex-1 gap-10 lg:grid-cols-5">
        <div className="min-h-112 scrollbar-none lg:col-span-3">
          {currentStep === 1 ? (
            <BasicInfoStep
              formData={formData}
              onChange={setFormData}
              onComplete={handleBasicInfoComplete}
              isSubmitting={isCreating}
              error={createError}
            />
          ) : null}

          {currentStep === 2 && createdBot ? (
            <TrainBotStep
              botId={createdBot.id}
              onComplete={() => setCurrentStep(3)}
            />
          ) : null}

          {currentStep === 3 ? (
            <PlaygroundStep
              workspaceId={workspaceId}
              botName={createdBot?.name ?? formData.name}
            />
          ) : null}
        </div>

        <CreateBotChatPreview
          formData={formData}
          botId={createdBot?.id}
          interactive={currentStep >= 3 && Boolean(createdBot?.id)}
        />
      </div>
    </div>
  )
}

export default CreateBotFlow
