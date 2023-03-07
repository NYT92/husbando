const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");
const rateLimit = require("express-rate-limit");

require("dotenv").config();

const middlewares = require("./middlewares");
const api = require("./routes/api");
const upload = require("./routes/upload");

const app = express();
const allowlist = [
  "https://husbando.pics",
  "https://api.husbando.pics",
  "https://i.husbando.pics",
  "http://localhost:3000",
  "http://localhost:5000"
];

const apilimiter = rateLimit({
  windowMs: 60000,
  max: (req) => {
    if (!allowlist.includes(req.headers.origin)) return 200;
    return 0;
  },
  standardHeaders: false,
  legacyHeaders: true,
  message: async (req, res) => {
    res.status(429).json({
      status: 429,
      message: "Too many requests, please wait before sending another request.",
    });
  },
  skip: async (req) => {
    // const gethost = req.protocol + '://' + req.get('host') + req.originalUrl
    allowlist.includes(req.headers.origin);
  }
});

const classAB_limiter = rateLimit({
  windowMs: 86400000,
  max: (req) => {
    if (!allowlist.includes(req.headers.origin)) return 20;
    return 0;
  },
  standardHeaders: false,
  legacyHeaders: true,
  message: async (req, res) => {
    res.status(429).json({
      status: 429,
      message: "Too many requests, please wait before sending another request.",
    });
  },
  skip: async (req) => {
    // const gethost = req.protocol + '://' + req.get('host') + req.originalUrl
    allowlist.includes(req.headers.origin);
  }
});

app.use(morgan("dev"));
app.use(helmet());
app.use(cors({
  origin: '*'
}));
app.set('trust proxy', true);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json({
    status: 200,
    message: "husbando api server",
    docs: "https://husbando.pics/docs",
  });
});

app.use("/api/v1", apilimiter, api);
app.use("/api/file", classAB_limiter, upload);

// app.use(middlewares.methodNotAllow);
app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

module.exports = app;
