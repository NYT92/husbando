import { z } from "zod";

import { images, InsertImg } from "@/db/schema";
import { db } from "@/server/drizzle-service";

import { file_extension } from "../../utils";

export default defineEventHandler(async (event) => {
  try {
    if (event.method !== "POST") {
      setResponseStatus(event, 405);
      return {
        status: 405,
        message: "Method Not Allowed",
      };
    }

    const body = await readBody(event);

    const parsedBody = z.object({
      id: z.string(),
      tags: z.string(),
      isNsfw: z.boolean(),
      isPublic: z.boolean(),
      width: z.number(),
      height: z.number(),
      source: z.string(),
      file_name: z.string(),
      url: z.string(),
    });

    if (!parsedBody.safeParse(body).success) {
      setResponseStatus(event, 400);
      return {
        status: 400,
        message: "Bad Request",
      };
    }

    const newImage: InsertImg = {
      id: body.id,
      tags: body.tags,
      isNsfw: body.isNsfw,
      public: body.isPublic,
      width: body.width,
      height: body.height,
      source: body.source,
      file_extension: file_extension(body.file_name),
      url:
        useRuntimeConfig().public.cdnUrl !== ""
          ? `${useRuntimeConfig().public.cdnUrl}/${body.id}.${file_extension(
              body.file_name
            )}`
          : `/${body.id}.${file_extension(body.file_name)}`,
      // @ts-ignore
      ip:
        event.node.req?.headers["x-forwarded-for"] ||
        event.node.req.socket?.remoteAddress ||
        "127.0.0.1",
    };

    const result = db.insert(images).values(newImage).run();

    return {
      success: true,
      data: result,
    };
  } catch (e: any) {
    return createError({
      message: e.message,
      statusCode: 500,
      statusMessage: "Internal Server Error",
    });
  }
});
