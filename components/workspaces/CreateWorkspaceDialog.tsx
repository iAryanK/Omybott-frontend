"use client"

import { useRouter } from "next/navigation"
import { useState, type ReactNode } from "react"
import { toast } from "sonner"
import { createWorkspace } from "@/lib/api-client"
import { formatApiError } from "@/lib/api"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { generateWorkspaceSlug } from "@/utils/util"

const CreateWorkspaceDialog = ({ children }: { children: ReactNode }) => {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const slug = generateWorkspaceSlug(name)

  const resetForm = () => {
    setName("")
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)

    try {
      const result = await createWorkspace({ name: name.trim(), active: true })

      if (!result.success) {
        toast.error(formatApiError(result.error))
        return
      }

      setOpen(false)
      resetForm()
      router.push(`/${result.data.id}`)
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to create workspace",
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen)
        if (!nextOpen) {
          resetForm()
        }
      }}
    >
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create workspace</DialogTitle>
            <DialogDescription>
              Add a new workspace to organize your bots.
            </DialogDescription>
          </DialogHeader>
          <FieldGroup className="py-4">
            <Field>
              <FieldLabel htmlFor="workspace-name">Name</FieldLabel>
              <Input
                id="workspace-name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="My workspace"
                required
                disabled={isSubmitting}
              />
              {name ? (
                <FieldDescription className="text-green-600 dark:text-green-500">
                  {slug}
                </FieldDescription>
              ) : null}
            </Field>
          </FieldGroup>
          <DialogFooter>
            <Button type="submit" disabled={isSubmitting || !name.trim()}>
              {isSubmitting ? "Creating..." : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default CreateWorkspaceDialog
