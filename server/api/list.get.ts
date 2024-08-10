import { images, info } from "../../db/schema";
import { desc, eq, or } from "drizzle-orm";
import { db } from "../drizzle-service";
import { getServerSession } from "#auth";

export default defineEventHandler(async (event) => {
  try {
    const session = await getServerSession(event);
    const query: any = getQuery(event);

    const results = await db
      .select()
      .from(images)
      .orderBy(desc(images.uploaded_at))
      .where(
        query.isNsfw !== "all" && query.isNsfw !== undefined
          ? eq(images.isNsfw, query.isNsfw === "true")
          : undefined
      )
      .limit(parseInt(query?.limit) || 50)
      .offset(parseInt(query?.offset) || 0);

    const meta = await db.select().from(info).where(eq(info.key, "db_meta"));

    return {
      success: true,
      info: {
        total: meta[0].totalUploads,
        limit: parseInt(query?.limit) || 50,
        offset: parseInt(query?.offset) || 0,
      },
      results: results.map((item) => {
        // @ts-ignore
        !session ? delete item?.ip : item?.ip;
        // @ts-ignore
        item.tags = (item.tags ?? "").split(",").map((tag) => tag.trim());
        return item;
      }),
    };
  } catch (e: any) {
    setResponseStatus(event, 500);
    return {
      status: 500,
      message: "Internal Server Error",
    };
  }
});
