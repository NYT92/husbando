import { images } from "../../../db/schema";
import { db } from "../../drizzle-service";
import { eq } from "drizzle-orm";
import { getServerSession } from "#auth";
export default defineEventHandler(async (event) => {
  try {
    const session = await getServerSession(event);

    if (!session) {
      throw createError({
        statusCode: 401,
        statusMessage: "Unauthorized",
      });
    }

    const body = await readBody(event);

    if (!body.id) {
      setResponseStatus(event, 400);
      return {
        status: 400,
        message: "Bad Request",
      };
    }

    const imgResp = db
      .delete(images)
      .where(eq(images.id, body.id))
      .run();

    return {
      success: true,
      message: "Image deleted successfully",
    };
  } catch (e: any) {
    setResponseStatus(event, 500);
    return {
      status: 500,
      message: "Internal Server Error",
    };
  }
});
