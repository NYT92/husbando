import { type InferSelectModel, type InferInsertModel, sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const images = sqliteTable("images", {
  id: text("id").primaryKey(),
  tags: text("tags"),
  isNsfw: integer("is_nsfw", { mode: "boolean" }),
  public: integer("public", { mode: "boolean" }).default(true),
  width: integer("width"),
  height: integer("height"),
  source: text("source"),
  uploaded_at: text("uploaded_at").default(sql`CURRENT_TIMESTAMP`),
  file_extension: text("file_extension"),
  url: text("url"),
  ip: text("ip"),
});

export const info = sqliteTable("info", {
  key: text("key").primaryKey(),
  totalUploads: integer("total_uploads").default(0),
  disabledUploads: integer("disabled_uploads", { mode: "boolean" }),
  accessIP: text("access_ip"),
});

export type Images = InferSelectModel<typeof images>;
export type InsertImg = InferInsertModel<typeof images>;


