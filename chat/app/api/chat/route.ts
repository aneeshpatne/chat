// /app/api/chat/route.ts
import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";
import { errorHandler } from "./errorhandler";
export const runtime = "edge";
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages, data, provider } = await req.json();
  console.log("Model from body data:", data?.model);
  const modelId = data?.model || "gpt-4.1-nano"; // Default to gpt-4.1 if no model is provided

  const result = await streamText({
    model: openai(modelId),
    temperature: 1,
    messages,
  });

  const stream = result.toDataStream();

  return result.toDataStreamResponse({ getErrorMessage: errorHandler });
}
