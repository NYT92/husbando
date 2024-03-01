import { images, InsertImg } from "@/db/schema";
import { db } from "@/server/drizzle-service";
import { eq } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  try {
    // get id as function parameter from route params
    const imgid = event.context.params?.id as string;
    const resp = await db
      .select()
      .from(images)
      .where(eq(images.id, imgid))
      .get();
  
    if (!resp) {
      setResponseStatus(event, 404);
      return {
        status: 404,
        message: "Not found"
      }
    }

    // @ts-ignore
    delete resp?.ip;
    // @ts-ignore
    delete resp?.public;
    // @ts-ignore
    resp.tags = (resp.tags ?? "").split(",").map((tag) => tag.trim());

    return resp;
  } catch (e: any) {
    setResponseStatus(event, 500);
    return {
      status: 500,
      message: "Internal Server Error"
    };
  }
});
