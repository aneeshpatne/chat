"use server";
import { db } from "@/lib/db";
import { chatMessages } from "@/lib/schema";
import { createClient } from "@/utlis/supabase/server";
export async function saveMessage({
  id,
  chatId,
  role,
  content,
}: {
  id: string;
  chatId: string;
  role: "user" | "assistant";
  content: string;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("User not authenticated");
  }
  await db.insert(chatMessages).values({
    id,
    chatId,
    role,
    content,
    userId: user.id,
  });
}
