"use client"

import { useMemo, useState } from "react"
import { ArrowRightIcon, SparklesIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { generateWorkspaceSlug } from "@/utils/util"

import type { CreateBotFormData } from "../types"
import VerticalFieldTimeline from "../VerticalFieldTimeline"

type BasicInfoStepProps = {
  formData: CreateBotFormData
  onChange: (data: CreateBotFormData) => void
  onComplete: () => void | Promise<void>
  isSubmitting?: boolean
  error?: string | null
}

const BASIC_INFO_FIELDS = [
  {
    id: "name",
    title: "Bot name",
    description: "Choose a display name for your bot.",
  },
  {
    id: "description",
    title: "Description",
    description: "Briefly describe what your bot does.",
  },
  {
    id: "primaryColor",
    title: "Primary color",
    description: "Pick a brand color for your chat widget.",
  },
  {
    id: "welcomeMessage",
    title: "Welcome message",
    description: "The first message users see when they open the chat.",
  },
  {
    id: "allowedDomains",
    title: "Allowed domains",
    description: "Domains where this bot can be embedded.",
  },
] as const

function parseAllowedDomains(value: string) {
  return value
    .split(",")
    .map((domain) => domain.trim())
    .filter(Boolean)
}

function formatAllowedDomains(domains: string[]) {
  return domains.join(", ")
}

const BasicInfoStep = ({
  formData,
  onChange,
  onComplete,
  isSubmitting = false,
  error = null,
}: BasicInfoStepProps) => {
  const [currentFieldIndex, setCurrentFieldIndex] = useState(0)
  const [maxReachedIndex, setMaxReachedIndex] = useState(0)
  const [domainsInput, setDomainsInput] = useState(
    formatAllowedDomains(formData.allowedDomains),
  )

  const slug = formData.slug || generateWorkspaceSlug(formData.name)

  const completedIndices = useMemo(() => {
    const completed: number[] = []

    if (formData.name.trim()) completed.push(0)
    if (formData.description.trim()) completed.push(1)
    if (formData.primaryColor) completed.push(2)
    if (formData.welcomeMessage.trim()) completed.push(3)
    if (formData.allowedDomains.length > 0) completed.push(4)

    return completed.filter((index) => index < currentFieldIndex)
  }, [formData, currentFieldIndex])

  const updateForm = (patch: Partial<CreateBotFormData>) => {
    onChange({ ...formData, ...patch })
  }

  const canContinue = () => {
    switch (currentFieldIndex) {
      case 0:
        return formData.name.trim().length > 0
      case 1:
        return formData.description.trim().length > 0
      case 2:
        return formData.primaryColor.length > 0
      case 3:
        return formData.welcomeMessage.trim().length > 0
      case 4:
        return formData.allowedDomains.length > 0
      default:
        return false
    }
  }

  const handleContinue = async () => {
    if (!canContinue() || isSubmitting) return

    if (currentFieldIndex === 0) {
      updateForm({ slug: generateWorkspaceSlug(formData.name) })
    }

    if (currentFieldIndex === 4) {
      await onComplete()
      return
    }

    setCurrentFieldIndex((index) => {
      const nextIndex = index + 1
      setMaxReachedIndex((max) => Math.max(max, nextIndex))
      return nextIndex
    })
  }

  const handleStepSelect = (index: number) => {
    if (index <= maxReachedIndex) {
      setCurrentFieldIndex(index)
    }
  }

  const handleEnterKey = (
    event: React.KeyboardEvent,
    { multiline = false }: { multiline?: boolean } = {},
  ) => {
    if (event.key !== "Enter" || (multiline && event.shiftKey) || isSubmitting) {
      return
    }

    event.preventDefault()
    void handleContinue()
  }

  const renderField = (index: number, isActive: boolean) => {
    switch (index) {
      case 0:
        return (
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="bot-name">Name</FieldLabel>
              <Input
                id="bot-name"
                value={formData.name}
                onChange={(event) =>
                  updateForm({
                    name: event.target.value,
                    slug: generateWorkspaceSlug(event.target.value),
                  })
                }
                onKeyDown={
                  isActive ? (event) => handleEnterKey(event) : undefined
                }
                placeholder="Support Assistant"
                autoFocus={isActive}
                disabled={isSubmitting}
              />
              {formData.name.trim() ? (
                <FieldDescription className="text-primary">
                  Slug: {slug}
                </FieldDescription>
              ) : null}
            </Field>
          </FieldGroup>
        )
      case 1:
        return (
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="bot-description">Description</FieldLabel>
              <Textarea
                id="bot-description"
                value={formData.description}
                onChange={(event) =>
                  updateForm({ description: event.target.value })
                }
                onKeyDown={
                  isActive
                    ? (event) => handleEnterKey(event, { multiline: true })
                    : undefined
                }
                placeholder="Helps customers with product questions and support."
                autoFocus={isActive}
                disabled={isSubmitting}
              />
            </Field>
          </FieldGroup>
        )
      case 2:
        return (
          <FieldGroup>
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
                  className="h-9 w-14 cursor-pointer p-1"
                  disabled={isSubmitting}
                />
                <Input
                  value={formData.primaryColor}
                  onChange={(event) =>
                    updateForm({ primaryColor: event.target.value })
                  }
                  onKeyDown={
                    isActive ? (event) => handleEnterKey(event) : undefined
                  }
                  placeholder="#e07b39"
                  className="font-mono uppercase"
                  disabled={isSubmitting}
                />
              </div>
            </Field>
          </FieldGroup>
        )
      case 3:
        return (
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="bot-welcome-message">
                Welcome message
              </FieldLabel>
              <Textarea
                id="bot-welcome-message"
                value={formData.welcomeMessage}
                onChange={(event) =>
                  updateForm({ welcomeMessage: event.target.value })
                }
                onKeyDown={
                  isActive
                    ? (event) => handleEnterKey(event, { multiline: true })
                    : undefined
                }
                placeholder="Hi! How can I help you today?"
                autoFocus={isActive}
                disabled={isSubmitting}
              />
            </Field>
          </FieldGroup>
        )
      case 4:
        return (
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="bot-allowed-domains">
                Allowed domains
              </FieldLabel>
              <Input
                id="bot-allowed-domains"
                value={domainsInput}
                onChange={(event) => {
                  setDomainsInput(event.target.value)
                  updateForm({
                    allowedDomains: parseAllowedDomains(event.target.value),
                  })
                }}
                onKeyDown={
                  isActive ? (event) => handleEnterKey(event) : undefined
                }
                placeholder="example.com, app.example.com"
                autoFocus={isActive}
                disabled={isSubmitting}
              />
              <FieldDescription>
                Separate multiple domains with commas.
              </FieldDescription>
            </Field>
          </FieldGroup>
        )
      default:
        return null
    }
  }

  const isLastField = currentFieldIndex === BASIC_INFO_FIELDS.length - 1

  return (
    <div className="flex h-full flex-col">
      <div className="mb-6">
        <h2 className="font-heading text-lg font-medium">Basic information</h2>
        <p className="text-xs text-muted-foreground">
          Set up your bot&apos;s identity and appearance.
        </p>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto pr-2 scrollbar-none">
        <VerticalFieldTimeline
          items={[...BASIC_INFO_FIELDS]}
          currentIndex={currentFieldIndex}
          maxReachedIndex={maxReachedIndex}
          completedIndices={completedIndices}
          onStepSelect={handleStepSelect}
          renderField={renderField}
        />
      </div>

      <div className="mt-6 flex flex-col items-end gap-2 pt-4">
        {error ? <FieldError className="w-full">{error}</FieldError> : null}
        <Button
          type="button"
          onClick={() => void handleContinue()}
          disabled={!canContinue() || isSubmitting}
        >
          {isLastField ? (
            <>
              <SparklesIcon data-icon="inline-start" />
              {isSubmitting ? "Creating..." : "Create bot"}
            </>
          ) : (
            <>
              Continue
              <ArrowRightIcon data-icon="inline-end" />
            </>
          )}
        </Button>
      </div>
    </div>
  )
}

export default BasicInfoStep
