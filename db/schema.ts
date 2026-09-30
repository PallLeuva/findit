import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
export const photos = sqliteTable("photos", {
  id: text("id").primaryKey(), owner: text("owner").notNull(),
  location: text("location").notNull(), notes: text("notes").notNull().default(""),
  objectKey: text("object_key").notNull(), contentType: text("content_type").notNull(),
  items: text("items").notNull(), width: integer("width").notNull(), height: integer("height").notNull(),
  createdAt: text("created_at").notNull(),
}, table => [index("idx_photos_owner_created").on(table.owner, table.createdAt)]);
