import { pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core";

export const chats = pgTable("chats", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull(),
  title: text("title"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});
