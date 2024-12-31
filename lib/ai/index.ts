import { openai } from "@ai-sdk/openai"
import { ollama } from "ollama-ai-provider"
import { google } from "@ai-sdk/google"
import { createAmazonBedrock } from "@ai-sdk/amazon-bedrock"
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

// Adding Bedrock model

export const bedrock = createAmazonBedrock({
  region: "us-east-1",
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
})

// export const customModel3 = (apiIdentifier: string) => {
//   return wrapLanguageModel({
//     model: bedrock(apiIdentifier),
//     middleware: customMiddleware,
//   })
// }

// Adding Ollama model
// export const customModel3 = ollama({
//   baseURL: "http://localhost:11434/api",
// })

// export const localOllama = new oa({
//   baseURL: "http://localhost:11434/v1",
//   apiKey: "ollama", // required but unused
// })
