/* eslint-disable consistent-return */
const express = require("express");
const { Deta } = require("deta");
const jwt = require("jsonwebtoken");

const router = express.Router();
const deta = Deta(process.env.DETA_KEY);
const tagsdata = require("../utils/tag-schema");

function getrandnum(length) {
  return Math.floor(Math.random() * length);
}

router.get("/", (req, res) => {
  res.json({
    status: 200,
    message: "husbando api server",
  });
});

router.get("/husbando/img/:id", async (req, res, next) => {
  const { id } = req.params;
  const db = deta.Base("husbando_f_list");
  try {
    if (id) {
      const items = await db.get(id);
      if (items === null) {
        return res.status(404).json({
          status: 404,
          message: "Not found",
        });
      }
      delete items.ip;
      res.status(200).json(items);
    } else {
      return res.status(400).json({
        status: 404,
        message: "Bad request / ID required",
      });
    }
  } catch (err) {
    next(err);
  }
});

router.get("/husbando/:type/:tag", async (req, res, next) => {
  const { type } = req.params;
  const { tag } = req.params;
  const db = deta.Base("husbando_f_list");
  try {
    let checkNSFW;
    switch (type) {
      case "sfw":
        checkNSFW = false;
        break;
      case "nsfw":
        checkNSFW = true;
        break;
      default:
        checkNSFW = false;
        break;
    }
    if (tagsdata.includes(tag)) {
      const items = await db.fetch({
        is_nsfw: checkNSFW,
        'tags?contains': tag,
      });
      const d = items.items;
      d.forEach((item) => {
        delete item.ip;
      });
      // if d is empty, return another random image
      if (d.length === 0) {
        return res.status(200).json(d[getrandnum(d.length)]);
      }
      res.status(200).json(d[getrandnum(d.length)]);
    } else {
      res.status(400).json({
        status: 400,
        message: "Catagory/tags not found",
      });
    }
  } catch (err) {
    next(err);
  }
});

router.post("/husbando/operation/delete", async (req, res, next) => {
  const { id } = req.body;
  const db = deta.Base("husbando_f_list");
  try {
    // get authorization header and validate it with jwt
    const bearerHeader = req.headers.authorization;
    if (!bearerHeader) {
      return res.status(401).json({
        status: 401,
        message: "Unauthorized",
      });
    }
    const bearer = bearerHeader.split(" ");
    const bearerToken = bearer[1];
    req.token = bearerToken;
    jwt.verify(req.token, process.env.JWT_TOKEN, async (err) => {
      if (err) {
        return res.status(403).json({
          status: 403,
          message: "Invalid token",
        });
      }
      if (id) {
        const data = await db.delete(id);
        if (data === null) {
          res.status(404).json({
            status: 404,
            message: "Not found",
          });
        }
        res.status(200).json({
          status: 200,
          message: "Data has been deleted",
        });
      }
      res.status(400).json({
        status: 404,
        message: "Bad request / ID required",
      });
    });
  } catch (err) {
    next(err);
  }
});

router.post("/husbando/operation/update", async (req, res, next) => {
  const { id } = req.body;
  const db = deta.Base("husbando_f_list");
  try {
    // get authorization header and validate it with jwt
    const bearerHeader = req.headers.authorization;
    if (!bearerHeader) {
      return res.status(401).json({
        status: 401,
        message: "Unauthorized",
      });
    }
    const bearer = bearerHeader.split(" ");
    const bearerToken = bearer[1];
    req.token = bearerToken;
    jwt.verify(req.token, process.env.JWT_TOKEN, async (err) => {
      if (err) {
        return res.status(403).json({
          status: 403,
          message: "Invalid token",
        });
      }
      if (id) {
        await db.update(
          {
            id,
            ...req.body,
          },
          id
        );
        return res.status(200).json({
          status: 200,
          message: "Data has been updated",
          data: req.body,
        });
      }
      res.status(400).json({
        status: 404,
        message: "Bad request / ID required",
      });
    });
  } catch (err) {
    next(err);
  }
});

router.get("/husbando/list", async (req, res) => {
  const db = deta.Base("husbando_f_list");
  const lnmt = req.query.limit;
  const xitems = await db.fetch({}, {
    limit: parseInt(lnmt, 10),
  });
  const d = xitems.items;
  d.forEach((item) => {
    delete item.ip;
  });
  res.status(200).json({
    status: 200,
    count: xitems.count,
    data: d,
  });
});

router.post("/husbando/list", async (req, res, next) => {
  const db = deta.Base("husbando_f_list");
  const bearerHeader = req.headers.authorization;
  const { limit } = req.query;
  const items = await db.fetch(req.body, {
    limit: parseInt(limit, 10),
    buffer: 10000,
  });
  if (!bearerHeader) {
    try {
      const d = items.items;
      d.forEach((item) => {
        delete item.ip;
      });
      res.status(200).json({
        status: 200,
        count: items.count,
        data: d,
      });
    } catch (err) {
      next(err);
    }
  } else {
    const bearer = bearerHeader.split(" ");
    const bearerToken = bearer[1];
    req.token = bearerToken;
    jwt.verify(req.token, process.env.JWT_TOKEN, async (err) => {
      if (err) {
        return res.status(403).json({
          status: 403,
          message: "Invalid token",
        });
      }
      try {
        const d = items.items;
        res.status(200).json(d);
      } catch (error) {
        next(error);
      }
    });
  }
});

module.exports = router;
