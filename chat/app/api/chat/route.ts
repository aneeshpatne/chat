// /app/api/chat/route.ts
import { openai } from "@ai-sdk/openai";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { streamText } from "ai";
import { errorHandler } from "./errorhandler";
export const runtime = "edge";
export const maxDuration = 30;

const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
});

export async function POST(req: Request) {
  const { messages, data, provider } = await req.json();
  const modelId = data?.model || "gpt-4.1-nano"; // Default to gpt-4.1 if no model is provided
  let result;
  if (provider == "openai") {
    result = await streamText({
      model: openai(modelId),
      temperature: 1,
      messages,
    });
  } else {
    result = await streamText({
      model: openrouter(modelId),
      temperature: 1,
      messages,
    });
  }

  const stream = result.toDataStream();

  return result.toDataStreamResponse({ getErrorMessage: errorHandler });
}
