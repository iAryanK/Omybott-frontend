"use client"

import { PencilIcon } from "lucide-react"

import {
  formatAllowedDomains,
  parseAllowedDomains,
  type BotFormData,
} from "@/components/bots/bot-form"
import { Button } from "@/components/ui/button"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select"
import { Textarea } from "@/components/ui/textarea"
import type { BotStatus } from "@/types/types"
import { generateWorkspaceSlug } from "@/utils/util"

type BotDetailsTabProps = {
  formData: BotFormData
  isEditing: boolean
  isSaving: boolean
  error: string | null
  onChange: (data: BotFormData) => void
  onEdit: () => void
  onCancel: () => void
  onSave: () => void
}

const BotDetailsTab = ({
  formData,
  isEditing,
  isSaving,
  error,
  onChange,
  onEdit,
  onCancel,
  onSave,
}: BotDetailsTabProps) => {
  const updateForm = (patch: Partial<BotFormData>) => {
    onChange({ ...formData, ...patch })
  }

  return (
    <div className="py-4">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs text-muted-foreground">
            {isEditing
              ? "Update your bot's identity and appearance settings."
              : "Your bot's identity and appearance details."}
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          {isEditing ? (
            <>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onCancel}
                disabled={isSaving}
              >
                Cancel
              </Button>
              <Button
                type="button"
                size="sm"
                onClick={onSave}
                disabled={isSaving}
              >
                {isSaving ? "Saving..." : "Save changes"}
              </Button>
            </>
          ) : (
            <Button type="button" variant="outline" size="sm" onClick={onEdit}>
              <PencilIcon data-icon="inline-start" />
              Edit
            </Button>
          )}
        </div>
      </div>

      <FieldGroup>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field>
            <FieldLabel htmlFor="bot-name">Name</FieldLabel>
            <Input
              id="bot-name"
              value={formData.name}
              onChange={(event) =>
                updateForm({
                  name: event.target.value,
                  slug: isEditing
                    ? generateWorkspaceSlug(event.target.value)
                    : formData.slug,
                })
              }
              readOnly={!isEditing}
              disabled={isSaving}
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="bot-slug">Slug</FieldLabel>
            <Input
              id="bot-slug"
              value={formData.slug}
              onChange={(event) => updateForm({ slug: event.target.value })}
              readOnly={!isEditing}
              disabled={isSaving}
            />
          </Field>
        </div>

        <Field>
          <FieldLabel htmlFor="bot-description">Description</FieldLabel>
          <Textarea
            id="bot-description"
            value={formData.description}
            onChange={(event) => updateForm({ description: event.target.value })}
            readOnly={!isEditing}
            disabled={isSaving}
            rows={3}
          />
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field>
            <FieldLabel htmlFor="bot-status">Status</FieldLabel>
            {isEditing ? (
              <NativeSelect
                id="bot-status"
                value={formData.status}
                onChange={(event) =>
                  updateForm({ status: event.target.value as BotStatus })
                }
                disabled={isSaving}
              >
                <NativeSelectOption value="ACTIVE">ACTIVE</NativeSelectOption>
                <NativeSelectOption value="INACTIVE">INACTIVE</NativeSelectOption>
              </NativeSelect>
            ) : (
              <Input id="bot-status" value={formData.status} readOnly />
            )}
          </Field>

          <Field>
            <FieldLabel htmlFor="bot-primary-color">Primary color</FieldLabel>
            <div className="flex items-center gap-3">
              <Input
                id="bot-primary-color"
                type="color"
                value={formData.primaryColor}
                onChange={(event) =>
                  updateForm({ primaryColor: event.target.value })
                }
                disabled={!isEditing || isSaving}
                className="h-8 w-14 p-1 disabled:cursor-default"
              />
              <Input
                value={formData.primaryColor}
                onChange={(event) =>
                  updateForm({ primaryColor: event.target.value })
                }
                readOnly={!isEditing}
                disabled={isSaving}
                className="font-mono uppercase"
              />
            </div>
          </Field>
        </div>

        <Field>
          <FieldLabel htmlFor="bot-welcome-message">Welcome message</FieldLabel>
          <Textarea
            id="bot-welcome-message"
            value={formData.welcomeMessage}
            onChange={(event) =>
              updateForm({ welcomeMessage: event.target.value })
            }
            readOnly={!isEditing}
            disabled={isSaving}
            rows={3}
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="bot-allowed-domains">Allowed domains</FieldLabel>
          <Input
            id="bot-allowed-domains"
            value={formatAllowedDomains(formData.allowedDomains)}
            onChange={(event) =>
              updateForm({
                allowedDomains: parseAllowedDomains(event.target.value),
              })
            }
            readOnly={!isEditing}
            disabled={isSaving}
            placeholder="No domains configured"
          />
        </Field>
      </FieldGroup>

      {error ? <FieldError className="mt-4">{error}</FieldError> : null}
    </div>
  )
}

export default BotDetailsTab
