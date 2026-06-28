"use client"

import { useCallback, useEffect, useState } from "react"
import { CopyIcon, KeyIcon, PlusIcon, Trash2Icon } from "lucide-react"

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
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  createBotApiKey,
  deleteBotApiKey,
  getBotApiKeys,
} from "@/lib/actions/api-keys"
import { formatApiError } from "@/lib/api"
import type { ApiKeyStatus, BotApiKey } from "@/types/types"

type BotApiKeysTabProps = {
  botId: string
}

function statusVariant(status: ApiKeyStatus) {
  switch (status) {
    case "ACTIVE":
      return "default" as const
    case "REVOKED":
      return "secondary" as const
    default:
      return "secondary" as const
  }
}

function formatStatus(status: ApiKeyStatus) {
  return status.charAt(0) + status.slice(1).toLowerCase()
}

function formatDate(value?: string) {
  if (!value) {
    return "Never"
  }

  return new Date(value).toLocaleString()
}

const BotApiKeysTab = ({ botId }: BotApiKeysTabProps) => {
  const [apiKeys, setApiKeys] = useState<BotApiKey[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [keyName, setKeyName] = useState("")
  const [createError, setCreateError] = useState<string | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [revealedKey, setRevealedKey] = useState<string | null>(null)
  const [revealedKeyDialogOpen, setRevealedKeyDialogOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<BotApiKey | null>(null)
  const [deleteError, setDeleteError] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const loadApiKeys = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    const result = await getBotApiKeys(botId)

    if (!result.success) {
      setError(formatApiError(result.error))
      setApiKeys([])
    } else {
      setApiKeys(result.data)
    }

    setIsLoading(false)
  }, [botId])

  useEffect(() => {
    void loadApiKeys()
  }, [loadApiKeys])

  const resetCreateForm = () => {
    setKeyName("")
    setCreateError(null)
  }

  const handleCreate = async () => {
    setCreateError(null)
    setIsCreating(true)

    try {
      const result = await createBotApiKey(botId, { name: keyName })

      if (!result.success) {
        setCreateError(formatApiError(result.error))
        return
      }

      setCreateDialogOpen(false)
      resetCreateForm()
      setRevealedKey(result.data.apiKey)
      setRevealedKeyDialogOpen(true)
      setCopied(false)
      await loadApiKeys()
    } catch (createFailure) {
      setCreateError(
        createFailure instanceof Error
          ? createFailure.message
          : "Failed to create API key. Please try again.",
      )
    } finally {
      setIsCreating(false)
    }
  }

  const handleCopyKey = async () => {
    if (!revealedKey) {
      return
    }

    try {
      await navigator.clipboard.writeText(revealedKey)
      setCopied(true)
    } catch {
      setCopied(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) {
      return
    }

    setDeleteError(null)
    setIsDeleting(true)

    try {
      const result = await deleteBotApiKey(botId, deleteTarget.id)

      if (!result.success) {
        setDeleteError(formatApiError(result.error))
        return
      }

      setDeleteTarget(null)
      await loadApiKeys()
    } catch (deleteFailure) {
      setDeleteError(
        deleteFailure instanceof Error
          ? deleteFailure.message
          : "Failed to delete API key. Please try again.",
      )
    } finally {
      setIsDeleting(false)
    }
  }

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

  return (
    <>
      <div className="py-4">
        <div className="mb-4 flex items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            {apiKeys.length} API key{apiKeys.length === 1 ? "" : "s"} for this
            bot.
          </p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              resetCreateForm()
              setCreateDialogOpen(true)
            }}
          >
            <PlusIcon data-icon="inline-start" />
            Create API key
          </Button>
        </div>

        {apiKeys.length === 0 ? (
          <Empty className="min-h-48 border border-dashed">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <KeyIcon />
              </EmptyMedia>
              <EmptyTitle>No API keys yet</EmptyTitle>
              <EmptyDescription>
                Create an API key to embed this bot on your website or connect
                it to your apps.
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  resetCreateForm()
                  setCreateDialogOpen(true)
                }}
              >
                <PlusIcon data-icon="inline-start" />
                Create API key
              </Button>
            </EmptyContent>
          </Empty>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last used</TableHead>
                <TableHead className="w-16 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {apiKeys.map((apiKey) => (
                <TableRow key={apiKey.id}>
                  <TableCell className="font-medium">{apiKey.name}</TableCell>
                  <TableCell>
                    <Badge variant={statusVariant(apiKey.status)}>
                      {formatStatus(apiKey.status)}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatDate(apiKey.lastUsedAt)}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      aria-label={`Delete ${apiKey.name}`}
                      onClick={() => {
                        setDeleteError(null)
                        setDeleteTarget(apiKey)
                      }}
                    >
                      <Trash2Icon />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      <Dialog
        open={createDialogOpen}
        onOpenChange={(open) => {
          if (!isCreating) {
            setCreateDialogOpen(open)
            if (!open) {
              resetCreateForm()
            }
          }
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create API key</DialogTitle>
            <DialogDescription>
              Give this key a name so you can identify it later.
            </DialogDescription>
          </DialogHeader>

          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="api-key-name">Name</FieldLabel>
              <Input
                id="api-key-name"
                value={keyName}
                onChange={(event) => setKeyName(event.target.value)}
                placeholder="Production website"
                disabled={isCreating}
              />
              {createError ? <FieldError>{createError}</FieldError> : null}
            </Field>
          </FieldGroup>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              disabled={isCreating}
              onClick={() => setCreateDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              disabled={isCreating || !keyName.trim()}
              onClick={() => void handleCreate()}
            >
              {isCreating ? (
                <>
                  <Spinner />
                  Creating...
                </>
              ) : (
                "Create key"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={revealedKeyDialogOpen}
        onOpenChange={(open) => {
          setRevealedKeyDialogOpen(open)
          if (!open) {
            setRevealedKey(null)
            setCopied(false)
          }
        }}
      >
        <DialogContent
          className="sm:max-w-lg"
          onInteractOutside={(event) => event.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle>Copy your API key</DialogTitle>
            <DialogDescription>
              This is the only time you will see this key. Copy it now and store
              it securely.
            </DialogDescription>
          </DialogHeader>

          <div className="rounded-lg border bg-muted/30 p-3">
            <code className="block wrap-break-word font-mono text-xs">
              {revealedKey}
            </code>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => void handleCopyKey()}
            >
              <CopyIcon data-icon="inline-start" />
              {copied ? "Copied" : "Copy key"}
            </Button>
            <Button
              type="button"
              onClick={() => setRevealedKeyDialogOpen(false)}
            >
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => {
          if (!open && !isDeleting) {
            setDeleteTarget(null)
            setDeleteError(null)
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete API key?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete{" "}
              <span className="font-medium text-foreground">
                {deleteTarget?.name}
              </span>
              . Any integrations using this key will stop working.
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

export default BotApiKeysTab
