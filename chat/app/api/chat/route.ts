// /app/api/chat/route.ts
import { openai } from "@ai-sdk/openai";
import { google } from "@ai-sdk/google";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { streamText } from "ai";
import { errorHandler } from "./errorhandler";
export const runtime = "edge";
export const maxDuration = 30;

const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
});

export async function POST(req: Request) {
  const { messages, data } = await req.json();
  console.log(data?.provider);
  const modelId = data?.model || "gpt-4.1-nano"; // Default to gpt-4.1 if no model is provided
  let result;
  if (data?.provider === "openai") {
    result = await streamText({
      model: openai(modelId),
      temperature: 1,
      messages,
      providerOptions: {
        openai: {
          reasoningSummary: "detailed",
        },
      },
    });
  } else if (data?.provider === "openrouter") {
    result = await streamText({
      model: openrouter(modelId),
      temperature: 1,
      messages,
    });
  } else if (data?.provider === "gemini") {
    result = await streamText({
      model: google(modelId),
      temperature: 1,
      messages,
    });
  }
  // Handle other providers here if needed
  else {
    return new Response("Unsupported provider", { status: 400 });
  }

  return result.toDataStreamResponse({ getErrorMessage: errorHandler });
}
