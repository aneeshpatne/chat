import { pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core";

export const chatMessages = pgTable("chat_messages", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull(),
  role: text("role").notNull(),
  content: text("content").notNull(),
  chatId: uuid("chat_id").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});
