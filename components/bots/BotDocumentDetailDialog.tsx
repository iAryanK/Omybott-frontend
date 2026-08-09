"use client"

import { useEffect, useState } from "react"
import { Trash2Icon } from "lucide-react"

import { formatFileSize } from "@/components/bots/document-upload"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Spinner } from "@/components/ui/spinner"
import { deleteBotDocument, getBotDocument } from "@/lib/api-client"
import { formatApiError } from "@/lib/api"
import type { BotDocument, DocumentStatus } from "@/types/types"

type BotDocumentDetailDialogProps = {
  botId: string
  document: BotDocument | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onDeleted: () => void
}

function statusVariant(status: DocumentStatus) {
  switch (status) {
    case "READY":
      return "secondary" as const
    case "FAILED":
      return "destructive" as const
    default:
      return "secondary" as const
  }
}

function formatStatus(status: DocumentStatus) {
  return status.charAt(0) + status.slice(1).toLowerCase()
}

const BotDocumentDetailDialog = ({
  botId,
  document,
  open,
  onOpenChange,
  onDeleted,
}: BotDocumentDetailDialogProps) => {
  const [content, setContent] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  useEffect(() => {
    if (!open || !document) {
      setContent(null)
      setError(null)
      setIsLoading(false)
      return
    }

    const documentId = document.id
    let cancelled = false

    async function loadContent() {
      setIsLoading(true)
      setError(null)
      setContent(null)

      const result = await getBotDocument(botId, documentId)

      if (cancelled) {
        return
      }

      if (!result.success) {
        setError(formatApiError(result.error))
      } else {
        setContent(result.data.content)
      }

      setIsLoading(false)
    }

    void loadContent()

    return () => {
      cancelled = true
    }
  }, [botId, document, open])

  const handleDelete = async () => {
    if (!document) {
      return
    }

    setDeleteError(null)
    setIsDeleting(true)

    try {
      const result = await deleteBotDocument(botId, document.id)

      if (!result.success) {
        setDeleteError(formatApiError(result.error))
        return
      }

      setDeleteDialogOpen(false)
      onOpenChange(false)
      onDeleted()
    } catch (deleteFailure) {
      setDeleteError(
        deleteFailure instanceof Error
          ? deleteFailure.message
          : "Failed to delete document. Please try again.",
      )
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="flex max-h-[85vh] flex-col gap-0 overflow-hidden sm:max-w-3xl">
          <DialogHeader className="shrink-0 border-b pb-4">
            <div className="flex items-start justify-between gap-4 pr-8">
              <div className="min-w-0 space-y-1">
                <DialogTitle className="truncate flex items-center gap-2">
                  {document?.fileName ?? "Document"}

                  {document ? (
                    <Badge variant={statusVariant(document.status)}>
                      {formatStatus(document.status)}
                    </Badge>
                  ) : null}

                </DialogTitle>
                {document ? (
                  <DialogDescription>
                    {document.fileType} · {formatFileSize(document.fileSizeBytes)}
                    {document.chunkCount != null
                      ? ` · ${document.chunkCount} chunks`
                      : ""}
                  </DialogDescription>
                ) : null}
              </div>
            </div>
          </DialogHeader>

          <div className="min-h-0 flex-1">
            {isLoading ? (
              <div className="flex min-h-64 items-center justify-center">
                <Spinner className="size-5" />
              </div>
            ) : error ? (
              <p className="text-sm text-destructive" role="alert">
                {error}
              </p>
            ) : (
              <ScrollArea className="h-[min(60vh,32rem)] bg-muted/20">
                <pre className="wrap-break-word p-4 font-mono text-xs/relaxed whitespace-pre-wrap text-foreground">
                  {content?.trim() ? content : "No content available."}
                </pre>
              </ScrollArea>
            )}
          </div>

          <DialogFooter className="shrink-0 border-t pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Close
            </Button>
            <Button
              type="button"
              variant="destructive"
              disabled={!document || isLoading}
              onClick={() => {
                setDeleteError(null)
                setDeleteDialogOpen(true)
              }}
            >
              <Trash2Icon data-icon="inline-start" />
              Delete document
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete document?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove{" "}
              <span className="font-medium text-foreground">
                {document?.fileName}
              </span>{" "}
              and its indexed chunks from this bot.
            </AlertDialogDescription>
          </AlertDialogHeader>
          {deleteError ? (
            <p className="text-sm text-destructive" role="alert">
              {deleteError}
            </p>
          ) : null}
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={isDeleting}
              onClick={(event) => {
                event.preventDefault()
                void handleDelete()
              }}
            >
              {isDeleting ? (
                <>
                  <Spinner />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

export default BotDocumentDetailDialog
