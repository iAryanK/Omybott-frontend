"use client"

import { useCallback, useEffect, useState } from "react"
import { FileTextIcon, PlusIcon } from "lucide-react"

import UploadBotDocumentsDialog from "@/components/bots/UploadBotDocumentsDialog"
import BotDocumentDetailDialog from "@/components/bots/BotDocumentDetailDialog"
import { getBotDocuments } from "@/lib/actions/documents"
import { formatApiError } from "@/lib/api"
import type { BotDocument, DocumentStatus } from "@/types/types"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { Spinner } from "@/components/ui/spinner"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { formatFileSize } from "@/components/bots/document-upload"

type BotDocumentsTabProps = {
  botId: string
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

const BotDocumentsTab = ({ botId }: BotDocumentsTabProps) => {
  const [documents, setDocuments] = useState<BotDocument[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false)
  const [selectedDocument, setSelectedDocument] = useState<BotDocument | null>(
    null,
  )
  const [detailDialogOpen, setDetailDialogOpen] = useState(false)

  const loadDocuments = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    const result = await getBotDocuments(botId)

    if (!result.success) {
      setError(formatApiError(result.error))
      setDocuments([])
    } else {
      setDocuments(result.data)
    }

    setIsLoading(false)
  }, [botId])

  useEffect(() => {
    void loadDocuments()
  }, [loadDocuments])

  if (isLoading) {
    return (
      <div className="flex min-h-48 items-center justify-center py-8">
        <Spinner className="size-5" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="py-8">
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      </div>
    )
  }

  if (documents.length === 0) {
    return (
      <>
        <Empty className="min-h-48 border border-dashed">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <FileTextIcon />
            </EmptyMedia>
            <EmptyTitle>No documents yet</EmptyTitle>
            <EmptyDescription>
              Upload training documents to build your bot&apos;s knowledge
              base.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button
              type="button"
              variant="outline"
              onClick={() => setUploadDialogOpen(true)}
            >
              <PlusIcon data-icon="inline-start" />
              Add documents
            </Button>
          </EmptyContent>
        </Empty>

        <UploadBotDocumentsDialog
          botId={botId}
          open={uploadDialogOpen}
          onOpenChange={setUploadDialogOpen}
          onUploaded={() => void loadDocuments()}
        />
      </>
    )
  }

  return (
    <>
      <div className="py-4">
        <div className="mb-4 flex items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            {documents.length} document{documents.length === 1 ? "" : "s"}{" "}
            ready for this bot.
          </p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setUploadDialogOpen(true)}
          >
            <PlusIcon data-icon="inline-start" />
            Add documents
          </Button>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Size</TableHead>
              <TableHead>Chunks</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {documents.map((document) => (
              <TableRow
                key={document.id}
                className="cursor-pointer"
                onClick={() => {
                  setSelectedDocument(document)
                  setDetailDialogOpen(true)
                }}
              >
                <TableCell className="max-w-48 truncate font-medium">
                  {document.fileName}
                </TableCell>
                <TableCell>{document.fileType}</TableCell>
                <TableCell>{formatFileSize(document.fileSizeBytes)}</TableCell>
                <TableCell>{document.chunkCount ?? "—"}</TableCell>
                <TableCell>
                  <Badge variant={statusVariant(document.status)}>
                    {formatStatus(document.status)}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <UploadBotDocumentsDialog
        botId={botId}
        open={uploadDialogOpen}
        onOpenChange={setUploadDialogOpen}
        onUploaded={() => void loadDocuments()}
      />

      <BotDocumentDetailDialog
        botId={botId}
        document={selectedDocument}
        open={detailDialogOpen}
        onOpenChange={setDetailDialogOpen}
        onDeleted={() => void loadDocuments()}
      />
    </>
  )
}

export default BotDocumentsTab
