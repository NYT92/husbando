import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dbCredentials: {
    url: process.env.TURSO_DB_URL!,
    authToken: process.env.TURSO_DB_TOKEN!,
  },
  dialect: "turso",
  out: "./drizzle",
  schema: "./db/schema.ts",
});
