import { getToken } from "#auth";
// @ts-ignore
import jwt from "jsonwebtoken";
export default eventHandler(async (event) => {
  const token = await getToken({ event });
  const signtkn = jwt.sign({
    token,
  }, useRuntimeConfig().Secret);
  if (token && signtkn) {
    return {
      statusCode: 200,
      token,
      signtkn,
    };
  }
  return {
    statusCode: 401,
    error: "Not authorized",
  };
});
