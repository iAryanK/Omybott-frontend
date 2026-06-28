import type { Bot, BotStatus, UpdateBotRequest } from "@/types/types"

export type BotFormData = {
  name: string
  slug: string
  description: string
  primaryColor: string
  welcomeMessage: string
  allowedDomains: string[]
  status: BotStatus
}

export function botToFormData(bot: Bot): BotFormData {
  return {
    name: bot.name,
    slug: bot.slug,
    description: bot.description ?? "",
    primaryColor: bot.primaryColor,
    welcomeMessage: bot.welcomeMessage,
    allowedDomains: bot.allowedDomains ?? [],
    status: bot.status,
  }
}

export function formDataToBot(bot: Bot, formData: BotFormData): Bot {
  return {
    ...bot,
    name: formData.name,
    slug: formData.slug,
    description: formData.description,
    primaryColor: formData.primaryColor,
    welcomeMessage: formData.welcomeMessage,
    allowedDomains: formData.allowedDomains,
    status: formData.status,
  }
}

export function formDataToUpdateRequest(formData: BotFormData): UpdateBotRequest {
  return {
    name: formData.name.trim(),
    description: formData.description.trim(),
    slug: formData.slug.trim(),
    welcomeMessage: formData.welcomeMessage.trim(),
    primaryColor: formData.primaryColor,
    allowedDomains: formData.allowedDomains,
    status: formData.status,
  }
}

export function parseAllowedDomains(value: string) {
  return value
    .split(",")
    .map((domain) => domain.trim())
    .filter(Boolean)
}

export function formatAllowedDomains(domains?: string[]) {
  if (!domains?.length) return ""
  return domains.join(", ")
}
