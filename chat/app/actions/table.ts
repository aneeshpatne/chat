"use server";
import { db } from "@/lib/db";
import { chats } from "@/lib/shema/chat";
import { createClient } from "@/utlis/supabase/server";
export async function fetchChats() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("You are not authenticated");
  }
  const chatsList = await db.select().from(chats).orderBy(chats.createdAt);
  return chatsList;
}
export async function createChat(
  sessionId: string,
  title: string,
  userId: string
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("You are not authenticated");
  }
  await db.insert(chats).values({
    id: sessionId,
    title,
    userId,
  });
}
