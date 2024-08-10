import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { z } from "zod";
import { verifyTurnstileToken } from "#imports";
import type { MultiPartData } from "h3";

import { file_extension } from "../../utils";

import { images, info, InsertImg } from "@/db/schema";
import { db } from "@/server/drizzle-service";
import { customAlphabet } from "nanoid";
import { eq, sql } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  try {
    const fileType = /^image\/(png|jpeg|jpg|gif|webp|bmp|tiff|avif)$/;
    const fileSize = 1024 * 1024 * 15;
    const form = (await readMultipartFormData(event)) as MultiPartData[];
    const fileInfo = (await readFormData(event)).get("file") as File;
    const alphabet = "0123456789abcdefghijklmnopqrstuvwxyz";
    const nanoid = customAlphabet(alphabet, 12);
    const genID = nanoid();

    const bufferToString = (buffer: Buffer) => buffer.toString("utf-8");
    const file = form.find((item) => item.name === "file")?.data;
    const cfToken = form.find((item) => item.name === "cfToken")?.data;
    const tags = form.find((item) => item.name === "tags")?.data
      ? // @ts-ignore
        bufferToString(form.find((item) => item.name === "tags").data)
      : "";
    const source = form.find((item) => item.name === "source")?.data
      ? // @ts-ignore
        bufferToString(form.find((item) => item.name === "source").data)
      : "";
    const isNsfw = form.find((item) => item.name === "isNsfw")?.data
      ? // @ts-ignore
        bufferToString(form.find((item) => item.name === "isNsfw").data) ===
        "true"
      : false;
    const isPublic = form.find((item) => item.name === "public")?.data
      ? // @ts-ignore
        bufferToString(form.find((item) => item.name === "public").data) ===
        "true"
      : false;
    const width = form.find((item) => item.name === "width")?.data
      ? parseInt(
          // @ts-ignore
          bufferToString(form.find((item) => item.name === "width").data)
        )
      : null;
    const height = form.find((item) => item.name === "height")?.data
      ? parseInt(
          // @ts-ignore
          bufferToString(form.find((item) => item.name === "height").data)
        )
      : null;

    const formData = {
      file,
      tags,
      source,
      isNsfw,
      isPublic,
      width,
      height,
    };

    if (event.method !== "POST") {
      setResponseStatus(event, 405);
      return {
        status: 405,
        message: "Method Not Allowed",
      };
    }

    if (!file) {
      setResponseStatus(event, 400);
      return { success: false, message: "file || bad request" };
    }

    if (fileInfo.size > fileSize) {
      setResponseStatus(event, 413);
      return {
        success: false,
        message: "Request Entity Too Large",
      };
    }

    if (!fileType.test(fileInfo.type)) {
      setResponseStatus(event, 400);
      return {
        success: false,
        message: "image only",
      };
    }

    if (!cfToken) {
      setResponseStatus(event, 400);
      return {
        success: false,
        message: "token not found",
      };
    }

    if (!verifyTurnstileToken(String(cfToken))) {
      setResponseStatus(event, 400);
      return {
        success: false,
        message: "token invalid",
      };
    }

    const s3Client = new S3Client({
      endpoint: useRuntimeConfig().r2.baseUrl,
      credentials: {
        accessKeyId: useRuntimeConfig().r2.accessID,
        secretAccessKey: useRuntimeConfig().r2.accessKey,
      },
      region: "auto",
    });

    const genURL =
      useRuntimeConfig().public.cdnUrl !== ""
        ? `${useRuntimeConfig().public.cdnUrl}/${genID}.${file_extension(
            fileInfo.name
          )}`
        : `/${genID}.${file_extension(fileInfo.name)}`;

    const parsedBody = z.object({
      tags: z.string(),
      isNsfw: z.boolean(),
      public: z.boolean().default(true),
      width: z.number(),
      height: z.number(),
      source: z.string().optional(),
    });

    const body: InsertImg = {
      id: genID,
      tags: formData.tags as string,
      isNsfw: formData.isNsfw as boolean,
      public: formData.isPublic as boolean,
      width: formData.width as number,
      height: formData.height as number,
      source: formData.source as string,
      file_extension: file_extension(fileInfo.name),
      url: genURL,
      ip: (event.node?.req?.headers["x-forwarded-for"] ||
        event.node?.req?.headers["cf-connecting-ip"] ||
        event.node?.req?.socket?.remoteAddress ||
        "127.0.0.1") as unknown as string,
    };

    if (!parsedBody.safeParse(body).success) {
      setResponseStatus(event, 400);
      return {
        success: false,
        message: "bad request",
        error: parsedBody.safeParse(body).error,
      };
    }
    const uploadResult = s3Client
      .send(
        new PutObjectCommand({
          Bucket: useRuntimeConfig().r2.bucketName,
          Key: `${genID.toString()}.${body.file_extension}`,
          Body: formData.file,
          Metadata: {
            file_name: fileInfo.name as string,
            width: body.width?.toString() as string,
            height: body.height?.toString() as string,
          },
          ContentType: fileInfo.type,
          ContentLength: fileInfo.size,
        })
      )
      .then(() => {
        return {
          success: true,
          message: "success",
        };
      })
      .catch((error) => {
        console.log(error);
        setResponseStatus(event, 500);
        return {
          success: false,
          message: "upload error",
        };
      });

    if (!(await uploadResult).success) {
      setResponseStatus(event, 500);
      return {
        success: false,
        message: "upload error",
      };
    }

    await db.insert(images).values(body);
    await db
      .update(info)
      .set({ totalUploads: sql`${info.totalUploads} + 1` })
      .where(eq(info.key, "db_meta"));

    setResponseStatus(event, 200);
    return {
      success: true,
      message: "success",
      url: genURL,
      body,
    };
  } catch (error) {
    console.log(error);
    setResponseStatus(event, 500);
    return {
      success: false,
      message: "Internal Server Error",
    };
  }
});

