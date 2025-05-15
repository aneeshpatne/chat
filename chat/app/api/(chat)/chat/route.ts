// /app/api/chat/route.ts
import { openai } from "@ai-sdk/openai";
import { google } from "@ai-sdk/google";
import { createGroq } from "@ai-sdk/groq";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { streamText } from "ai";
import { createClient } from "@/utlis/supabase/server";
import { saveMessage } from "@/app/actions/savemessage";
//import { v4 as uuidv4 } from "uuid";
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

  // We'll store information about the user message to save it after streaming
  let userMessageToSave = null;
  if (messages.length > 0 && messages[messages.length - 1].role === "user") {
    const userMessage = messages[messages.length - 1];
    userMessageToSave = {
      id: userMessage.id || crypto.randomUUID(),
      content: userMessage.content,
      chatId: data?.sessionId,
    };
  }

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
      onFinish: async (result) => {
        try {
          const cookieHeader = req.headers.get("cookie");

          // If we have a user message to save, save it first
          if (userMessageToSave) {
            const userResponse = await fetch(
              "http://localhost:3000/api/savemessage",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Cookie: cookieHeader || "",
                },
                body: JSON.stringify({
                  id: userMessageToSave.id,
                  chatId: userMessageToSave.chatId,
                  role: "user",
                  content: userMessageToSave.content,
                }),
                credentials: "include",
              }
            );

            if (!userResponse.ok) {
              console.error(
                "Failed to save user message:",
                await userResponse.text()
              );
            }
          }

          // Then save the assistant's response
          const response = await fetch(
            "http://localhost:3000/api/savemessage",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Cookie: cookieHeader || "",
              },
              body: JSON.stringify({
                id: crypto.randomUUID(),
                chatId: data?.sessionId,
                role: "assistant",
                content: result.text,
                reasoning: result.reasoning,
                promptTokens: result.usage.promptTokens,
                completionTokens: result.usage.completionTokens,
                totalTokens: result.usage.totalTokens,
              }),
              credentials: "include",
            }
          );

          if (!response.ok) {
            console.error(
              "Failed to save OpenAI message:",
              await response.text()
            );
          }
        } catch (error) {
          console.error("Error saving OpenAI message:", error);
        }
      },
    });
  } else if (data?.provider === "openrouter") {
    result = streamText({
      model: openrouter(modelId),
      temperature: 0.7,
      messages,
      onFinish: async (result) => {
        try {
          const cookieHeader = req.headers.get("cookie");

          // If we have a user message to save, save it first
          if (userMessageToSave) {
            const userResponse = await fetch(
              "http://localhost:3000/api/savemessage",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Cookie: cookieHeader || "",
                },
                body: JSON.stringify({
                  id: userMessageToSave.id,
                  chatId: userMessageToSave.chatId,
                  role: "user",
                  content: userMessageToSave.content,
                }),
                credentials: "include",
              }
            );

            if (!userResponse.ok) {
              console.error(
                "Failed to save user message:",
                await userResponse.text()
              );
            }
          }

          // Then save the assistant's response
          const response = await fetch(
            "http://localhost:3000/api/savemessage",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Cookie: cookieHeader || "",
              },
              body: JSON.stringify({
                id: crypto.randomUUID(),
                chatId: data?.sessionId,
                role: "assistant",
                content: result.text,
                reasoning: result.reasoning,
                promptTokens: result.usage?.promptTokens,
                completionTokens: result.usage?.completionTokens,
                totalTokens: result.usage?.totalTokens,
              }),
              credentials: "include",
            }
          );

          if (!response.ok) {
            console.error(
              "Failed to save OpenRouter message:",
              await response.text()
            );
          }
        } catch (error) {
          console.error("Error saving OpenRouter message:", error);
        }
      },
    });
  } else if (data?.provider === "gemini") {
    result = streamText({
      model: google(modelId),
      temperature: 1,
      messages,
      onFinish: async (result) => {
        try {
          const cookieHeader = req.headers.get("cookie");

          // If we have a user message to save, save it first
          if (userMessageToSave) {
            const userResponse = await fetch(
              "http://localhost:3000/api/savemessage",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Cookie: cookieHeader || "",
                },
                body: JSON.stringify({
                  id: userMessageToSave.id,
                  chatId: userMessageToSave.chatId,
                  role: "user",
                  content: userMessageToSave.content,
                }),
                credentials: "include",
              }
            );

            if (!userResponse.ok) {
              console.error(
                "Failed to save user message:",
                await userResponse.text()
              );
            }
          }

          const response = await fetch(
            "http://localhost:3000/api/savemessage",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Cookie: cookieHeader || "",
              },
              body: JSON.stringify({
                id: crypto.randomUUID(),
                chatId: data?.sessionId,
                role: "assistant",
                content: result.text,
                // Gemini might have different usage structure
                promptTokens: result.usage?.promptTokens,
                completionTokens: result.usage?.completionTokens,
                totalTokens: result.usage?.totalTokens,
              }),
              credentials: "include",
            }
          );

          if (!response.ok) {
            console.error(
              "Failed to save Gemini message:",
              await response.text()
            );
          }
        } catch (error) {
          console.error("Error saving Gemini message:", error);
        }
      },
    });
  } else if (data?.provider === "groq") {
    result = streamText({
      model: groq(modelId),
      temperature: 0.7,
      messages,
      onFinish: async (result) => {
        try {
          const cookieHeader = req.headers.get("cookie");

          // If we have a user message to save, save it first
          if (userMessageToSave) {
            const userResponse = await fetch(
              "http://localhost:3000/api/savemessage",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Cookie: cookieHeader || "",
                },
                body: JSON.stringify({
                  id: userMessageToSave.id,
                  chatId: userMessageToSave.chatId,
                  role: "user",
                  content: userMessageToSave.content,
                }),
                credentials: "include",
              }
            );

            if (!userResponse.ok) {
              console.error(
                "Failed to save user message:",
                await userResponse.text()
              );
            }
          }

          const response = await fetch(
            "http://localhost:3000/api/savemessage",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Cookie: cookieHeader || "",
              },
              body: JSON.stringify({
                id: crypto.randomUUID(),
                chatId: data?.sessionId,
                role: "assistant",
                content: result.text,
                promptTokens: result.usage?.promptTokens,
                completionTokens: result.usage?.completionTokens,
                totalTokens: result.usage?.totalTokens,
              }),
              credentials: "include",
            }
          );

          if (!response.ok) {
            console.error(
              "Failed to save Groq message:",
              await response.text()
            );
          }
        } catch (error) {
          console.error("Error saving Groq message:", error);
        }
      },
    });
  } else {
    return new Response("Unsupported provider", { status: 400 });
  }

  return result.toDataStreamResponse({
    sendReasoning: true,
    sendSources: true,
  });
}
