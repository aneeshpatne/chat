"use server";

import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";

export async function generateTitle(content: string): Promise<string> {
  const result = await generateText({
    model: openai("gpt-4.1-nano"),
    prompt: `Generate a title for the following content:\n\n${content}`,
  });
  return result.text;
}
