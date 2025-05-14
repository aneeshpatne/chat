// /app/api/chat/route.ts
import { openai } from "@ai-sdk/openai";
import { google } from "@ai-sdk/google";
import { createGroq } from "@ai-sdk/groq";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { streamText } from "ai";
import { createClient } from "@/utlis/supabase/server";
export const runtime = "edge";
export const maxDuration = 30;

const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
});
const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return new Response("You are not authenticated", { status: 401 });
  }
  const { messages, data } = await req.json();
  console.log(data?.provider);
  const modelId = data?.model || "gpt-4.1-nano";
  let result;
  if (data?.provider === "openai") {
    result = streamText({
      model: openai.responses(modelId),
      messages,
      providerOptions: {
        openai: {
          reasoningSummary: "detailed",
        },
      },
    });
  } else if (data?.provider === "openrouter") {
    result = streamText({
      model: openrouter(modelId),
      temperature: 0.7,
      messages,
    });
  } else if (data?.provider === "gemini") {
    result = streamText({
      model: google(modelId),
      temperature: 1,
      messages,
    });
  } else if (data?.provider === "groq") {
    result = streamText({
      model: groq(modelId),
      temperature: 0.7,
      messages,
    });
  } else {
    return new Response("Unsupported provider", { status: 400 });
  }

  return result.toDataStreamResponse({
    sendReasoning: true,
    sendSources: true,
  });
}
