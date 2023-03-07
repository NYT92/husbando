const S3 = require("aws-sdk/clients/s3");
const fs = require("fs");

require("dotenv").config;

const s3 = new S3({
  endpoint: process.env.ENDPOINT,
  accessKeyId: process.env.ACCESSKEYID,
  secretAccessKey: process.env.SECRETACCESSKEY,
  signatureVersion: "v4",
});
const file_extension = (fn) => fn.slice(((fn.lastIndexOf(".") - 1) >>> 0) + 2);
function uploadFile(file) {
  const fileStream = fs.createReadStream(file.path);
  const genRanHex = (size) => [...Array(size)]
      .map(() => Math.floor(Math.random() * 16).toString(16))
      .join("");
  const uploadParams = {
    Bucket: process.env.BUCKETNAME,
    Body: fileStream,
    Key: `${genRanHex(9)}.${file_extension(file.filename)}`,
    ContentType: file.mimetype,
  };
  return s3.upload(uploadParams).promise();
}

function deleteFile(key) {
  const deleteParams = {
    Bucket: process.env.BUCKETNAME,
    Key: key,
  };
  return s3.deleteObject(deleteParams).promise();
}

function getFileStream(fileKey) {
  const downloadParams = {
    Key: fileKey,
    Bucket: process.env.BUCKETNAME,
  };

  return s3.getObject(downloadParams).createReadStream();
}

function getPresignedUrl(fileKey) {
  const params = {
    Bucket: process.env.BUCKETNAME,
    Key: fileKey,
    Expires: 60 * 60,
  };
  return s3.getSignedUrlPromise("getObject", params);
}

module.exports = { 
  uploadFile, 
  deleteFile,
  getFileStream, 
  getPresignedUrl 
};
