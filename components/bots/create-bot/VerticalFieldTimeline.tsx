"use client"

import { cn } from "@/lib/utils"
import { CheckIcon } from "lucide-react"

type VerticalTimelineItem = {
  id: string
  title: string
  description?: string
}

type VerticalFieldTimelineProps = {
  items: VerticalTimelineItem[]
  currentIndex: number
  maxReachedIndex: number
  completedIndices: number[]
  onStepSelect: (index: number) => void
  renderField: (index: number, isActive: boolean) => React.ReactNode
}

const VerticalFieldTimeline = ({
  items,
  currentIndex,
  maxReachedIndex,
  completedIndices,
  onStepSelect,
  renderField,
}: VerticalFieldTimelineProps) => {
  return (
    <ol className="relative flex flex-col">
      {items.map((item, index) => {
        const isCompleted = completedIndices.includes(index)
        const isActive = index === currentIndex
        const isReachable = index <= maxReachedIndex
        const isLast = index === items.length - 1

        return (
          <li key={item.id} className="relative flex gap-4 pb-8 last:pb-0">
            {!isLast ? (
              <div
                className={cn(
                  "absolute top-8 left-[0.9375rem] h-[calc(100%-1rem)] w-0.5 -translate-x-1/2 transition-colors duration-300",
                  isCompleted ? "bg-primary" : "bg-border",
                )}
              />
            ) : null}

            <div className="relative z-10 shrink-0">
              <button
                type="button"
                disabled={!isReachable}
                onClick={() => onStepSelect(index)}
                aria-label={`Go to step ${index + 1}: ${item.title}`}
                aria-current={isActive ? "step" : undefined}
                className={cn(
                  "flex size-7 items-center justify-center rounded-full border-2 text-[0.625rem] font-semibold transition-colors duration-300",
                  isCompleted
                    ? "border-primary bg-primary text-primary-foreground"
                    : isActive
                      ? "border-primary bg-background text-primary"
                      : "border-border bg-background text-muted-foreground",
                  isReachable &&
                    !isActive &&
                    "cursor-pointer hover:border-primary/70 hover:text-primary",
                  !isReachable && "cursor-default",
                )}
              >
                {isCompleted ? (
                  <CheckIcon className="size-3.5" />
                ) : (
                  <span>{index + 1}</span>
                )}
              </button>
            </div>

            <div className="min-w-0 flex-1 pt-0.5">
              <div className="mb-1">
                <p
                  className={cn(
                    "text-sm font-medium",
                    isActive || isCompleted
                      ? "text-foreground"
                      : "text-muted-foreground",
                  )}
                >
                  {item.title}
                </p>
                {item.description ? (
                  <p className="text-xs text-muted-foreground">
                    {item.description}
                  </p>
                ) : null}
              </div>

              {isReachable ? (
                <div
                  className={cn(
                    "mt-3",
                    !isActive && "opacity-80",
                  )}
                >
                  {renderField(index, isActive)}
                </div>
              ) : null}
            </div>
          </li>
        )
      })}
    </ol>
  )
}

export default VerticalFieldTimeline
