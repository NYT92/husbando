import { DeleteObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { eq } from "drizzle-orm";
import { images } from "~/db/schema";
import { getServerSession } from "#auth";
import { db } from "~/server/drizzle-service";

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

    await db.delete(images).where(eq(images.id, body.id)).run();

    const s3Client = new S3Client({
      endpoint: useRuntimeConfig().r2.baseUrl,
      credentials: {
        accessKeyId: useRuntimeConfig().r2.accessKeyId,
        secretAccessKey: useRuntimeConfig().r2.secretAccessKey,
      },
      region: "auto",
    });

    const deleteObjectCommand = new DeleteObjectCommand({
      Bucket: useRuntimeConfig().r2.bucketName,
      Key: body.id + "." + body.file_extension,
    });

    try {
      await s3Client.send(deleteObjectCommand);
      console.log("Image deleted from S3 successfully");
    } catch (error) {
      console.error("Error deleting image from S3:", error);
      setResponseStatus(event, 500);
      return {
        status: 500,
        message: "Internal Server Error",
      };
    }

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
