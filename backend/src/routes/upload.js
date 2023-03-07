/* eslint-disable no-unused-vars */
/* eslint-disable consistent-return */
/* eslint-disable no-bitwise */
const express = require("express");
const util = require("util");
const fs = require("fs");
const { Deta } = require("deta");
const { Validator } = require("jsonschema");
const sizeOf = require("image-size");
const jwt = require("jsonwebtoken");
require("dotenv").config;

const upload = require("../utils/multer");
const {
  uploadFile,
  deleteFile,
} = require("../utils/s3");

const unlinkFile = util.promisify(fs.unlink);
const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    status: 200,
    message: 'husbando api server',
  });
});

router.post("/hdoupload", upload.single("image"), async (req, res, next) => {
  try {
    const data = req.body;
    const image = req.file;
    const tag_arr_list = [
      "man",
      "boy",
      "shota",
      "muscle",
      "trap",
      "neko",
      "bunny",
      "furry",
      "kiss",
      "gif",
      "dark_skin",
      "high_school",
      "hug",
      "love",
      "prostitute",
      "anal",
      "ass",
      "boobs",
      "bdsm",
      "blowjob",
      "gangbang",
      "creampie",
      "cumshot",
      "big_breasts",
      "large_penis",
      "peeled_foreskin",
      "threesome",
      "foursome",
      "masturbate",
      "paizuri",
      "naked",
    ];
    const deta = Deta(process.env.DETA_KEY);
    const db = deta.Base("husbando_f_list");
    if (!image) {
      const error = new Error(
        "Bad Request / No image was found in the request"
      );
      error.code = 400;
      return next(error);
    }
    const file_extension = image.originalname.slice(
      ((image.originalname.lastIndexOf(".") - 1) >>> 0) + 2
    );
    const getImgdimensions = sizeOf(image.path);
    const v = new Validator();
    const schema = {
      type: "object",
      properties: {
        tags: {
          type: "string",
        },
        is_nsfw: {
          type: "string",
        },
        source: {
          type: "string",
        },
      },
      required: ["tags", "is_nsfw"],
    };
    const valid_result = v.validate(
      {
        tags: data.tags,
        is_nsfw: data.is_nsfw,
        source: data.source,
      },
      schema
    );
    if (valid_result.valid) {
      const result = await uploadFile(image);
      const filenameRes = result.Key.includes("husbando")
        ? result.Key.replace("husbando/", "")
        : result.Key;
      let nsfwstrtobool = null;
      if (data.is_nsfw === "true") {
        nsfwstrtobool = true;
      } else if (data.is_nsfw === "false") {
        nsfwstrtobool = false;
      }
      const date = new Date().toJSON();
      await db.put(
        {
          tags: JSON.parse(data.tags),
          is_nsfw: nsfwstrtobool,
          width: getImgdimensions.width,
          height: getImgdimensions.height,
          source: data.source,
          id: result.Key,
          uploaded_at: date,
          file_extension,
          url: `https://i.husbando.pics/${filenameRes}`,
          ip: req.ip,
        },
        result.Key.split(".")[0]
      );
      await unlinkFile(req.file.path);
      res.status(200).json({
        status: 200,
        message: "File uploaded successfully",
        data: {
          id: result.Key,
          file_extension,
          width: getImgdimensions.width,
          height: getImgdimensions.height,
          url: `https://i.husbando.pics/${filenameRes}`,
          tags: JSON.parse(data.tags),
          uploaded_at: date,
          is_nsfw: nsfwstrtobool,
          source: data.source || null,
        },
      });
    } else if (!valid_result.valid) {
      await unlinkFile(req.file.path);
      res.status(400).json({
        status: 400,
        message: "Bad request / All of the body fields cannot be blank",
      });
    }
  } catch (error) {
    error.code = 500;
    next(error);
  }
});

router.post("/hdodelete", async (req, res, next) => {
  // check jwt token and verify it
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) {
    return res.status(401).json({
      status: 401,
      message: "Unauthorized / No token provided",
    });
  }
  jwt.verify(token, process.env.JWT_TOKEN, async (err, user) => {
    if (err) {
      return res.status(403).json({
        status: 403,
        message: "Forbidden / Invalid token provided",
      });
    }
    req.user = user;
    try {
      const data = req.body;
      const deta = Deta(process.env.DETA_KEY);
      const db = deta.Base("husbando_f_list");
      const result = await db.get(data.id);
      if (result) {
        const deleteResult = await deleteFile(result.id);
        if (deleteResult) {
          await db.delete(data.id);
          res.status(200).json({
            status: 200,
            message: "File deleted successfully",
            data: {
              id: data.id,
            },
          });
        }
      } else {
        res.status(400).json({
          status: 400,
          message: "Bad request / File does not exist",
        });
      }
    } catch (error) {
      error.code = 500;
      next(error);
    }
  });
});

module.exports = router;
