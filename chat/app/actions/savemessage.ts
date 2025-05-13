"use server";

console.log("savemessage.ts loaded");

import { db } from "@/lib/db";
import { chatMessages } from "@/lib/schema";
import { createClient } from "@/utlis/supabase/server";

export async function saveMessage({
  id,
  chatId,
  role,
  content,
  reasoning,
  promptTokens,
  completionTokens,
  totalTokens,
}: {
  id: string;
  chatId: string;
  role: "user" | "assistant";
  content: string;
  reasoning?: string;
  promptTokens?: number;
  completionTokens?: number;
  totalTokens?: number;
}) {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    throw new Error("User not authenticated");
  }

  await db.insert(chatMessages).values({
    id,
    chatId,
    role,
    content,
    userId: user.id,
    reasoning: reasoning || null,
    promptTokens: promptTokens || null,
    completionTokens: completionTokens || null,
    totalTokens: totalTokens || null,
  });
}
