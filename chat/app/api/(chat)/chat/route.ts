import { openai } from "@ai-sdk/openai";
import { google } from "@ai-sdk/google";
import { createGroq } from "@ai-sdk/groq";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { streamText } from "ai";
import { createClient } from "@/utlis/supabase/server";

export const runtime = "edge";
export const maxDuration = 30;

const openrouter = createOpenRouter({ apiKey: process.env.OPENROUTER_API_KEY });
const groq = createGroq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return new Response("You are not authenticated", { status: 401 });
  }
  const { messages, data } = await req.json();
  const provider = data?.provider;
  const modelId = data?.model || "gpt-4.1-nano";
  const sessionId = data?.sessionId;
  const cookieHeader = req.headers.get("cookie") || "";
  const transformedMessages = messages.map((msg: any) => {
    if (msg.parts) {
      const textContent = msg.parts
        .filter((part: any) => part.type === "text")
        .map((part: any) => part.text)
        .join("");
      return {
        role: msg.role,
        content: textContent,
      };
    } else {
      return {
        role: msg.role,
        content: msg.content,
      };
    }
  });
  const lastMsg = transformedMessages[transformedMessages.length - 1];
  const userMsg =
    lastMsg?.role === "user"
      ? {
          id: lastMsg.id || crypto.randomUUID(),
          chatId: sessionId,
          role: "user",
          content: lastMsg.content,
        }
      : null;

  async function saveMessage(message: Record<string, unknown>) {
    const res = await fetch("https://chat.aneeshpatne.com/api/savemessage", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieHeader,
      },
      credentials: "include",
      body: JSON.stringify(message),
    });
    if (!res.ok) console.error("Failed to save message:", await res.text());
  }

  async function saveAll(result: {
    text: string;
    reasoning?: string;
    usage?: {
      promptTokens?: number;
      completionTokens?: number;
      totalTokens?: number;
    };
  }) {
    try {
      if (userMsg) await saveMessage(userMsg);
      const assistantMsg = {
        id: crypto.randomUUID(),
        chatId: sessionId,
        role: "assistant",
        content: result.text,
        reasoning: result.reasoning,
        promptTokens: result.usage?.promptTokens,
        completionTokens: result.usage?.completionTokens,
        totalTokens: result.usage?.totalTokens,
      };
      await saveMessage(assistantMsg);
    } catch (err) {
      console.error(`Error saving messages for provider ${provider}:`, err);
    }
  }
  const providers: Record<string, () => ReturnType<typeof streamText>> = {
    openai: () =>
      streamText({
        model: openai(modelId),
        messages: transformedMessages,
        providerOptions: { openai: { reasoningSummary: "detailed" } },
        onFinish: saveAll,
      }),
    openrouter: () =>
      streamText({
        model: openrouter(modelId),
        temperature: 0.7,
        messages: transformedMessages,
        onFinish: saveAll,
      }),
    gemini: () =>
      streamText({
        model: google(modelId),
        temperature: 1,
        messages: transformedMessages,
        onFinish: saveAll,
      }),
    groq: () =>
      streamText({
        model: groq(modelId),
        temperature: 0.7,
        messages: transformedMessages,
        onFinish: saveAll,
      }),
  };

  const streamFn = providers[provider];
  if (!streamFn) {
    return new Response("Unsupported provider", { status: 400 });
  }

  const result = streamFn();
  return result.toDataStreamResponse({
    sendReasoning: true,
    sendSources: true,
  });
}
