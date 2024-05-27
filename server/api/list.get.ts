import { images } from "../../db/schema";
import { desc } from "drizzle-orm";
import { db } from "../drizzle-service";
import { getServerSession } from "#auth";

export default defineEventHandler(async (event) => {
  try {
    const session = await getServerSession(event);
    const query: any = getQuery(event);

    const resp = await db
      .select()
      .from(images)
      .orderBy(desc(images.uploaded_at))
      .limit(parseInt(query?.limit) || 50)
      .offset(parseInt(query?.offset) || 0);

    const filteredResults = resp.filter((item) => {
      if (query.show === "nsfw") {
        return item.isNsfw === true;
      } else if (query.show === "not_nsfw") {
        return item.isNsfw === false;
      }

      return true;
    });

    return {
      success: true,
      info: {
        total: filteredResults.length,
        limit: parseInt(query?.limit) || 50,
        offset: parseInt(query?.offset) || 0,
      },
      results: filteredResults.map((item) => {
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
