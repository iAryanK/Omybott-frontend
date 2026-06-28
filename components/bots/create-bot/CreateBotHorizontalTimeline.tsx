"use client"

import { cn } from "@/lib/utils"
import { CheckIcon } from "lucide-react"

import { CREATE_BOT_STEPS, type CreateBotStep } from "./types"

type CreateBotHorizontalTimelineProps = {
  currentStep: CreateBotStep
}

const CreateBotHorizontalTimeline = ({
  currentStep,
}: CreateBotHorizontalTimelineProps) => {
  const progress =
    CREATE_BOT_STEPS.length > 1
      ? ((currentStep - 1) / (CREATE_BOT_STEPS.length - 1)) * 100
      : 0

  return (
    <div className="w-full pt-2 pb-4">
      <div className="relative mx-auto w-full">
        <div className="absolute top-4 right-4 left-4 h-0.5 bg-border" />
        <div
          className="absolute top-4 left-4 h-0.5 bg-primary transition-all duration-500 ease-out"
          style={{ width: `calc((100% - 2rem) * ${progress / 100})` }}
        />

        <ol className="relative flex justify-between">
          {CREATE_BOT_STEPS.map(({ step, label }) => {
            const isCompleted = step < currentStep
            const isActive = step === currentStep

            return (
              <li
                key={step}
                className="flex flex-col items-center gap-2"
                aria-current={isActive ? "step" : undefined}
              >
                <div
                  className={cn(
                    "relative z-10 flex size-8 items-center justify-center rounded-full border-2 bg-background text-xs font-medium transition-colors duration-300",
                    isCompleted || isActive
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border text-muted-foreground",
                  )}
                >
                  {isCompleted ? (
                    <CheckIcon className="size-3.5" />
                  ) : (
                    <span>{step}</span>
                  )}
                </div>
                <span
                  className={cn(
                    "max-w-24 text-center text-[0.625rem] leading-tight font-medium sm:max-w-none sm:text-xs",
                    isCompleted || isActive
                      ? "text-primary"
                      : "text-muted-foreground",
                  )}
                >
                  {label}
                </span>
              </li>
            )
          })}
        </ol>
      </div>
    </div>
  )
}

export default CreateBotHorizontalTimeline
