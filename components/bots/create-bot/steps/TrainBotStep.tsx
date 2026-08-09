"use client"

import { useRef, useState } from "react"
import {
  BookOpenIcon,
  FileTextIcon,
  Trash2Icon,
  UploadIcon,
} from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import {
  Attachment,
  AttachmentAction,
  AttachmentActions,
  AttachmentContent,
  AttachmentDescription,
  AttachmentGroup,
  AttachmentMedia,
  AttachmentTitle,
} from "@/components/ui/attachment"
import { Spinner } from "@/components/ui/spinner"
import { uploadBotDocument } from "@/lib/api-client"
import { formatApiError } from "@/lib/api"
import {
  ACCEPTED_FILE_TYPES,
  formatFileSize,
  isAcceptedFile,
} from "@/components/bots/document-upload"

type TrainBotStepProps = {
  botId: string
  onComplete: () => void
}

const TrainBotStep = ({ botId, onComplete }: TrainBotStepProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [files, setFiles] = useState<File[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleFileSelect = (selectedFiles: FileList | null) => {
    if (!selectedFiles?.length) {
      return
    }

    const nextFiles = Array.from(selectedFiles)
    const invalidFiles = nextFiles.filter((file) => !isAcceptedFile(file))

    if (invalidFiles.length > 0) {
      toast.error("Only PDF, TXT, and Markdown files are supported.")
      return
    }

    setFiles((current) => {
      const existingNames = new Set(current.map((file) => file.name))
      const uniqueFiles = nextFiles.filter((file) => !existingNames.has(file.name))
      return [...current, ...uniqueFiles]
    })
  }

  const handleRemoveFile = (index: number) => {
    setFiles((current) => current.filter((_, fileIndex) => fileIndex !== index))
  }

  const handleSubmit = async () => {
    if (files.length === 0) {
      onComplete()
      return
    }

    setIsSubmitting(true)

    try {
      for (const file of files) {
        const formData = new FormData()
        formData.append("file", file)

        const result = await uploadBotDocument(botId, formData)

        if (!result.success) {
          toast.error(`${file.name}: ${formatApiError(result.error)}`)
          return
        }

        if (result.data.status === "FAILED") {
          toast.error(
            result.data.failureReason ??
              `${file.name} failed to process. Please try again.`,
          )
          return
        }
      }

      onComplete()
    } catch (submitError) {
      toast.error(
        submitError instanceof Error
          ? submitError.message
          : "Failed to upload documents. Please try again.",
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex h-full flex-col">
      <div className="mb-6">
        <h2 className="font-heading text-lg font-medium">Train your bot</h2>
        <p className="text-xs text-muted-foreground">
          Upload documents and sources to teach your bot.
        </p>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept={ACCEPTED_FILE_TYPES}
        multiple
        className="hidden"
        onChange={(event) => {
          handleFileSelect(event.target.files)
          event.target.value = ""
        }}
      />

      {files.length === 0 ? (
        <Empty className="min-h-0 flex-1 border border-dashed">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <BookOpenIcon />
            </EmptyMedia>
            <EmptyTitle>No training data yet</EmptyTitle>
            <EmptyDescription>
              Add PDF, TXT, or Markdown files so your bot can answer questions
              accurately.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button
              type="button"
              variant="outline"
              disabled={isSubmitting}
              onClick={() => fileInputRef.current?.click()}
            >
              <UploadIcon data-icon="inline-start" />
              Upload sources
            </Button>
          </EmptyContent>
        </Empty>
      ) : (
        <div className="min-h-0 flex-1 space-y-4">
          <AttachmentGroup className="flex-wrap">
            {files.map((file, index) => (
              <Attachment key={`${file.name}-${index}`} size="sm">
                <AttachmentMedia>
                  <FileTextIcon />
                </AttachmentMedia>
                <AttachmentContent>
                  <AttachmentTitle>{file.name}</AttachmentTitle>
                  <AttachmentDescription>
                    {formatFileSize(file.size)}
                  </AttachmentDescription>
                </AttachmentContent>
                <AttachmentActions>
                  <AttachmentAction
                    aria-label={`Remove ${file.name}`}
                    disabled={isSubmitting}
                    onClick={() => handleRemoveFile(index)}
                  >
                    <Trash2Icon />
                  </AttachmentAction>
                </AttachmentActions>
              </Attachment>
            ))}
          </AttachmentGroup>

          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={isSubmitting}
            onClick={() => fileInputRef.current?.click()}
          >
            <UploadIcon data-icon="inline-start" />
            Add more files
          </Button>
        </div>
      )}

      <div className="mt-6 flex justify-end pt-4">
        <Button type="button" disabled={isSubmitting} onClick={handleSubmit}>
          {isSubmitting ? (
            <>
              <Spinner />
              Uploading...
            </>
          ) : (
            "Continue to playground"
          )}
        </Button>
      </div>
    </div>
  )
}

export default TrainBotStep
