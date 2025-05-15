import { db } from "@/lib/db";
import { chatMessages } from "@/lib/shema/chat_message";
import { createClient } from "@/utlis/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const {
      id,
      chatId,
      role,
      content,
      reasoning,
      promptTokens,
      completionTokens,
      totalTokens,
    } = await request.json();

    // Validate required fields
    if (!id || !chatId || !role || !content) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate role
    if (role !== "user" && role !== "assistant") {
      return NextResponse.json(
        { error: "Role must be 'user' or 'assistant'" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 }
      );
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

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error saving message:", error);
    return NextResponse.json(
      { error: "Failed to save message" },
      { status: 500 }
    );
  }
}
