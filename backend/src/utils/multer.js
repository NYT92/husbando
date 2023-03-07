const multer = require("multer");
const fs = require("fs");
const path = require("path");

const maxsize = 12 * 1024 * 1024;

const dir = "./tmp";
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

const fileStorageEngine = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage: fileStorageEngine,
  limits: {
    fileSize: maxsize,
  },
  fileFilter(req, file, callback) {
    const ext = path.extname(file.originalname);
    if (ext !== ".png" && ext !== ".jpg" && ext !== ".gif" && ext !== ".jpeg") {
      const error = new Error("Bad Request / Accept only image");
      error.code = 400;
      return callback(error);
    }

    if (req.headers["content-length"] > maxsize) {
      const error = new Error("Requested file size limit exceeded");
      error.code = 413;
      console.log(error);
      return callback(error);
    }

    return callback(null, true);
  },
});

module.exports = upload;
