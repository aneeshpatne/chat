import { google } from "@ai-sdk/google";
import { generateText } from "ai";
export async function POST(req: Request) {
  const { message } = await req.json();
  try {
    const { text } = await generateText({
      model: google("gemini-2.0-flash-lite"),
      prompt: `You are a helpful assistant that creates short, relevant titles for chatbot conversations.

Generate a **catchy and concise chat title** (maximum 5 words) based on the user's first message to a chatbot.  
The title should reflect the **main topic or intent** of the message.

Avoid generic titles like “New Chat” or “Hello”.  
Respond with **only the title**, no punctuation, quotes, or extra text.

Message:
"""
${message}
"""
`,
    });
    return Response.json(
      { title: text },
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error generating text:", error);
    return new Response("Error generating text", { status: 500 });
  }
}
