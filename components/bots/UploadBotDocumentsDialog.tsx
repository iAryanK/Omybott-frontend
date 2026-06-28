"use client"

import { useRef, useState } from "react"
import { FileTextIcon, Trash2Icon, UploadIcon } from "lucide-react"

import {
  ACCEPTED_FILE_TYPES,
  formatFileSize,
  isAcceptedFile,
} from "@/components/bots/document-upload"
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
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Spinner } from "@/components/ui/spinner"
import { uploadBotDocument } from "@/lib/actions/documents"
import { formatApiError } from "@/lib/api"

type UploadBotDocumentsDialogProps = {
  botId: string
  open: boolean
  onOpenChange: (open: boolean) => void
  onUploaded: () => void
}

const UploadBotDocumentsDialog = ({
  botId,
  open,
  onOpenChange,
  onUploaded,
}: UploadBotDocumentsDialogProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [files, setFiles] = useState<File[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const resetForm = () => {
    setFiles([])
    setError(null)
  }

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen && !isUploading) {
      resetForm()
    }

    if (!isUploading) {
      onOpenChange(nextOpen)
    }
  }

  const handleFileSelect = (selectedFiles: FileList | null) => {
    if (!selectedFiles?.length) {
      return
    }

    const nextFiles = Array.from(selectedFiles)
    const invalidFiles = nextFiles.filter((file) => !isAcceptedFile(file))

    if (invalidFiles.length > 0) {
      setError("Only PDF, TXT, and Markdown files are supported.")
      return
    }

    setError(null)
    setFiles((current) => {
      const existingNames = new Set(current.map((file) => file.name))
      const uniqueFiles = nextFiles.filter((file) => !existingNames.has(file.name))
      return [...current, ...uniqueFiles]
    })
  }

  const handleRemoveFile = (index: number) => {
    setFiles((current) => current.filter((_, fileIndex) => fileIndex !== index))
  }

  const handleUpload = async () => {
    if (files.length === 0) {
      setError("Select at least one file to upload.")
      return
    }

    setError(null)
    setIsUploading(true)

    try {
      for (const file of files) {
        const formData = new FormData()
        formData.append("file", file)

        const result = await uploadBotDocument(botId, formData)

        if (!result.success) {
          setError(`${file.name}: ${formatApiError(result.error)}`)
          return
        }

        if (result.data.status === "FAILED") {
          setError(
            result.data.failureReason ??
              `${file.name} failed to process. Please try again.`,
          )
          return
        }
      }

      resetForm()
      onOpenChange(false)
      onUploaded()
    } catch (uploadError) {
      setError(
        uploadError instanceof Error
          ? uploadError.message
          : "Failed to upload documents. Please try again.",
      )
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <>
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

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Upload documents</DialogTitle>
            <DialogDescription>
              Add PDF, TXT, or Markdown files to train your bot.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {files.length === 0 ? (
              <Button
                type="button"
                variant="outline"
                className="w-full"
                disabled={isUploading}
                onClick={() => fileInputRef.current?.click()}
              >
                <UploadIcon data-icon="inline-start" />
                Choose files
              </Button>
            ) : (
              <>
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
                          disabled={isUploading}
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
                  disabled={isUploading}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <UploadIcon data-icon="inline-start" />
                  Add more files
                </Button>
              </>
            )}

            {error ? (
              <p className="text-sm text-destructive" role="alert">
                {error}
              </p>
            ) : null}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              disabled={isUploading}
              onClick={() => handleOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              disabled={isUploading || files.length === 0}
              onClick={() => void handleUpload()}
            >
              {isUploading ? (
                <>
                  <Spinner />
                  Uploading...
                </>
              ) : (
                "Upload"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default UploadBotDocumentsDialog
