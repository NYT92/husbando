import { InsertImg, images } from "../../../db/schema";
import { db } from "../../drizzle-service";
import { eq } from "drizzle-orm";
import { getServerSession } from "#auth";
import { z } from "zod";

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
      setResponseStatus(event, 500);
      return {
        status: 500,
        message: "Internal Server Error",
      };
    }

    const updateSchema = z.object({
      id: z.string(),
      tags: z.array(z.string()),
      isNsfw: z.boolean(),
      isPublic: z.boolean(),
      source: z.string(),
    });

    const editImgMeta: InsertImg = {
      id: body.id,
      tags: body.tags,
      isNsfw: body.isNsfw,
      public: body.isPublic,
      source: body.source,
    };

    if (!updateSchema.safeParse(body)) {
      setResponseStatus(event, 400);
      return {
        status: 400,
        message: "Bad Request",
      };
    }

    db.update(images).set(editImgMeta).where(eq(images.id, body.id)).run();

    return {
      success: true,
      message: "Image metadata updated successfully",
    };
  } catch (e: any) {
    setResponseStatus(event, 500);
    return {
      status: 500,
      message: "Internal Server Error",
    };
  }
});
