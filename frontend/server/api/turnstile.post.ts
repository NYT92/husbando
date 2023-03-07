export default eventHandler(async (event) => {
  const { token } = await readBody(event);
  const secretKey = useRuntimeConfig().turnstile.secretKey;
  const endpoint = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
  return await $fetch(endpoint, {
    method: "POST",
    body: `secret=${encodeURIComponent(
      secretKey
    )}&response=${encodeURIComponent(token)}`,
    headers: {
      "content-type": "application/x-www-form-urlencoded",
    },
  });
});
