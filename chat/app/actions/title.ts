"use server";

import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";
import { createClient } from "@/utlis/supabase/server";

export async function generateTitle(content: string): Promise<string> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("You are not authenticated");
  }
  const result = await generateText({
    model: openai("gpt-4.1-nano"),
    prompt: `You are a helpful assistant that creates short, relevant titles for chatbot conversations.
Generate a TITLE for a chat based on the user's first message.
Generate a **catchy and concise chat title** (maximum 5 words) based on the user's first message to a chatbot.  
The title should reflect the **main topic or intent** of the message.

Avoid generic titles like “New Chat” or “Hello”.  
Respond with **only the title**, no punctuation, quotes, or extra text.

Message:
"""
${content}
"""
`,
  });
  return result.text;
}
