import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client/http";;
import * as schema from "../db/schema";

export const db = drizzle(
  createClient({
    url: useRuntimeConfig().db.url,
    authToken: useRuntimeConfig().db.token,
  }),
  { schema }
);
