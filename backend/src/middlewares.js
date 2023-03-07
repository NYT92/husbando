/* eslint-disable no-unused-vars */
function notFound(req, res, next) {
  res.status(404);
  const error = new Error(`Not Found`);
  next(error);
}

function errorHandler(err, req, res, next) {
  res.status(res.statusCode || 500);
  return res.json({
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? "nope" : err.stack,
  });
}

module.exports = {
  notFound,
  errorHandler,
};
