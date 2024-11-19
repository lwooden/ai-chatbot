import {
  type Message,
  StreamData,
  convertToCoreMessages,
  streamObject,
  streamText,
} from "ai"
import { z } from "zod"

import { auth } from "@/app/(auth)/auth"
import { customModel, customModel2, localOllama, ollama } from "@/lib/ai"
import { models } from "@/lib/ai/models"
import { systemPrompt } from "@/lib/ai/prompts"
import {
  deleteChatById,
  getChatById,
  getDocumentById,
  saveChat,
  saveDocument,
  saveMessages,
  saveSuggestions,
} from "@/lib/db/queries"
import type { Suggestion } from "@/lib/db/schema"
import {
  generateUUID,
  getMostRecentUserMessage,
  sanitizeResponseMessages,
} from "@/lib/utils"

import { generateTitleFromUserMessage } from "../../actions"

export const maxDuration = 60

type AllowedTools =
  | "createDocument"
  | "updateDocument"
  | "requestSuggestions"
  | "getWeather"

const blocksTools: AllowedTools[] = [
  "createDocument",
  "updateDocument",
  "requestSuggestions",
]

const weatherTools: AllowedTools[] = ["getWeather"]

const allTools: AllowedTools[] = [...blocksTools, ...weatherTools]

export async function POST(request: Request) {
  const {
    id,
    messages,
    modelId,
  }: { id: string; messages: Array<Message>; modelId: string } =
    await request.json()

  console.log(messages)

  const session = await auth()

  if (!session || !session.user || !session.user.id) {
    return new Response("Unauthorized", { status: 401 })
  }

  const model = models.find((model) => model.id === modelId)

  if (!model) {
    return new Response("Model not found", { status: 404 })
  }

  const coreMessages = convertToCoreMessages(messages)
  const userMessage = getMostRecentUserMessage(coreMessages)

  // console.log("coreMessages", coreMessages)
  // console.log("userMessage", userMessage)

  if (!userMessage) {
    return new Response("No user message found", { status: 400 })
  }

  const chat = await getChatById({ id })

  if (!chat) {
    const title = await generateTitleFromUserMessage({ message: userMessage })
    await saveChat({ id, userId: session.user.id, title })
  }

  await saveMessages({
    messages: [
      { ...userMessage, id: generateUUID(), createdAt: new Date(), chatId: id },
    ],
  })

  const streamingData = new StreamData()

  const result = await streamText({
    model: ollama("llama3.2"),
    messages: coreMessages,
    maxSteps: 5,
    experimental_activeTools: allTools,
    experimental_telemetry: {
      isEnabled: true,
      functionId: "stream-text",
    },
  })

  return result.toDataStreamResponse({
    data: streamingData,
  })
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get("id")

  if (!id) {
    return new Response("Not Found", { status: 404 })
  }

  const session = await auth()

  if (!session || !session.user) {
    return new Response("Unauthorized", { status: 401 })
  }

  try {
    const chat = await getChatById({ id })

    if (chat.userId !== session.user.id) {
      return new Response("Unauthorized", { status: 401 })
    }

    await deleteChatById({ id })

    return new Response("Chat deleted", { status: 200 })
  } catch (error) {
    return new Response("An error occurred while processing your request", {
      status: 500,
    })
  }
}
