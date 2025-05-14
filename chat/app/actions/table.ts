"use server";
import { db } from "@/lib/db";
import { chats } from "@/lib/shema/chat";
export async function fetchChats() {
  const chatsList = await db.select().from(chats).orderBy(chats.createdAt);
  return chatsList;
}
export async function createChat(
  sessionId: string,
  title: string,
  userId: string
) {
  await db.insert(chats).values({
    id: sessionId,
    title,
    userId,
  });
}
