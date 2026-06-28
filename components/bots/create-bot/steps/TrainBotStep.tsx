"use client"

import { BookOpenIcon, UploadIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"

type TrainBotStepProps = {
  onComplete: () => void
}

const TrainBotStep = ({ onComplete }: TrainBotStepProps) => {
  return (
    <div className="flex h-full flex-col">
      <div className="mb-6">
        <h2 className="font-heading text-lg font-medium">Train your bot</h2>
        <p className="text-xs text-muted-foreground">
          Upload documents and sources to teach your bot.
        </p>
      </div>

      <Empty className="min-h-0 flex-1 border border-dashed">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <BookOpenIcon />
          </EmptyMedia>
          <EmptyTitle>No training data yet</EmptyTitle>
          <EmptyDescription>
            Add PDFs, URLs, or text snippets so your bot can answer questions
            accurately.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button type="button" variant="outline" disabled>
            <UploadIcon data-icon="inline-start" />
            Upload sources
          </Button>
        </EmptyContent>
      </Empty>

      <div className="mt-6 flex justify-end pt-4">
        <Button type="button" onClick={onComplete}>
          Continue to playground
        </Button>
      </div>
    </div>
  )
}

export default TrainBotStep
