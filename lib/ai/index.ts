import { openai } from "@ai-sdk/openai"
import { createOllama } from "ollama-ai-provider"
import { google } from "@ai-sdk/google"
import {
  experimental_wrapLanguageModel as wrapLanguageModel,
  streamText,
} from "ai"
import { OpenAI as oa } from "openai"

import { customMiddleware } from "./custom-middleware"

// Adding OpenAI models
export const customModel = (apiIdentifier: string) => {
  return wrapLanguageModel({
    model: openai(apiIdentifier),
    middleware: customMiddleware,
  })
}
// Adding Gemini 1.5 model
export const customModel2 = (apiIdentifier: string) => {
  return wrapLanguageModel({
    model: google(apiIdentifier),
    middleware: customMiddleware,
  })
}

// Adding Ollama model
export const localOllama = new oa({
  baseURL: "http://localhost:11434/v1",
  apiKey: "ollama", // required but unused
})

export const ollama = createOllama({
  // optional settings, e.g.
  baseURL: "http://localhost:11434/api",
})
