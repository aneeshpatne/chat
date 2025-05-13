import { pgTable, uuid, text, integer, timestamp } from "drizzle-orm/pg-core";

export const chatMessages = pgTable("chat_messages", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull(),
  role: text("role").notNull(),
  content: text("content").notNull(),
  reasoning: text("reasoning"), // new: flattened reasoning parts
  promptTokens: integer("prompt_tokens"), // new: prompt tokens used
  completionTokens: integer("completion_tokens"), // new: completion tokens used
  totalTokens: integer("total_tokens"), // new: total tokens used
  chatId: uuid("chat_id").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});
