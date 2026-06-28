"use client"

import { useState } from "react"

import CreateBotChatPreview from "./CreateBotChatPreview"
import CreateBotHorizontalTimeline from "./CreateBotHorizontalTimeline"
import BasicInfoStep from "./steps/BasicInfoStep"
import PlaygroundStep from "./steps/PlaygroundStep"
import TrainBotStep from "./steps/TrainBotStep"
import { DEFAULT_BOT_FORM, type CreateBotFormData, type CreateBotStep } from "./types"

type CreateBotFlowProps = {
  workspaceId: string
}

const CreateBotFlow = ({ workspaceId }: CreateBotFlowProps) => {
  const [currentStep, setCurrentStep] = useState<CreateBotStep>(1)
  const [formData, setFormData] = useState<CreateBotFormData>(DEFAULT_BOT_FORM)

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <CreateBotHorizontalTimeline currentStep={currentStep} />

      <div className="grid min-h-0 flex-1 gap-10 lg:grid-cols-5">
        <div className="min-h-112 scrollbar-none lg:col-span-3">
          {currentStep === 1 ? (
            <BasicInfoStep
              formData={formData}
              onChange={setFormData}
              onComplete={() => setCurrentStep(2)}
            />
          ) : null}

          {currentStep === 2 ? (
            <TrainBotStep onComplete={() => setCurrentStep(3)} />
          ) : null}

          {currentStep === 3 ? (
            <PlaygroundStep workspaceId={workspaceId} botName={formData.name} />
          ) : null}
        </div>

        <CreateBotChatPreview
          formData={formData}
          showSampleConversation={currentStep >= 3}
        />
      </div>
    </div>
  )
}

export default CreateBotFlow
