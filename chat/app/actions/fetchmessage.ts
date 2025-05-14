"use server";
import { db } from "@/lib/db";
import { chatMessages } from "@/lib/shema/chat_message";
import { eq, desc } from "drizzle-orm";

export async function getMessagesByChatId(chatId: string) {
  console.log("Fetching messages for chatId:", chatId);

  const rows = await db
    .select()
    .from(chatMessages)
    .where(eq(chatMessages.chatId, chatId))
    .orderBy(chatMessages.createdAt);

  const transformed = rows.map((msg) => ({
    id: msg.id,
    role: msg.role,
    parts: [
      ...(msg.content ? [{ type: "text", text: msg.content }] : []),
      ...(msg.reasoning
        ? [{ type: "reasoning", reasoning: msg.reasoning }]
        : []),
    ],
    usage: {
      promptTokens: msg.promptTokens ?? 0,
      completionTokens: msg.completionTokens ?? 0,
      totalTokens: msg.totalTokens ?? 0,
    },
    createdAt: msg.createdAt,
  }));

  return transformed;
}
