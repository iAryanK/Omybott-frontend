export type CreateBotStep = 1 | 2 | 3

export type CreateBotFormData = {
  name: string
  slug: string
  description: string
  primaryColor: string
  welcomeMessage: string
  allowedDomains: string[]
}

export const CREATE_BOT_STEPS = [
  { step: 1 as const, label: "Basic Information" },
  { step: 2 as const, label: "Train your bot" },
  { step: 3 as const, label: "Playground" },
]

export const DEFAULT_BOT_FORM: CreateBotFormData = {
  name: "",
  slug: "",
  description: "",
  primaryColor: "#e07b39",
  welcomeMessage: "Hi! How can I help you today?",
  allowedDomains: [],
}
