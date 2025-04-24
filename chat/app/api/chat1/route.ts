import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";
export function POST(req: Request) {
  const result = streamText({
    model: openai.responses("o3-mini"),
    prompt: "Tell me about the Mission burrito debate in San Francisco.",
    providerOptions: {
      openai: {
        reasoningSummary: "detailed",
      },
    },
  });
  return result.toDataStreamResponse({
    sendReasoning: true,
  });
}
