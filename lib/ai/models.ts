// Define your models here.

export interface Model {
  id: string
  label: string
  apiIdentifier: string
  description: string
}

export const models: Array<Model> = [
  {
    id: "gpt-4o-mini",
    label: "GPT 4o mini",
    apiIdentifier: "gpt-4o-mini",
    description: "Small model for fast, lightweight tasks",
  },
  {
    id: "gpt-4o",
    label: "GPT 4o",
    apiIdentifier: "gpt-4o",
    description: "For complex, multi-step tasks",
  },
  {
    id: "Gemini 1.5",
    label: "Gemini 1.5 Pro",
    apiIdentifier: "gemini-1.5-pro-latest",
    description: "For generating code, summaries, and more",
  },
  {
    id: "Ollama",
    label: "Ollama",
    apiIdentifier: "Ollama",
    description: "Ragging locally",
  },
] as const

export const DEFAULT_MODEL_NAME: string = "gpt-4o-mini"
