// /app/api/chat/route.ts
import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";

export const runtime = "edge";
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = await streamText({
    model: openai("gpt-4.1"),
    messages,
  });

  const stream = result.toDataStream();

  return new Response(stream, {
    headers: { "Content-Type": "text/plain; charset=utf-8" }, // Change content type
  });
}
