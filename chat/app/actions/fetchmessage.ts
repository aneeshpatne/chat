"use server";
import { db } from "@/lib/db";
import { chatMessages } from "@/lib/schema";
import { eq } from "drizzle-orm";

export async function getMessagesByChatId(chatId: string) {
  console.log("Fetching messages for chatId:", chatId);
  return db
    .select()
    .from(chatMessages)
    .where(eq(chatMessages.chatId, chatId))
    .orderBy(chatMessages.createdAt);
}
