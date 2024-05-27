// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  css: ["~/assets/style.css"],
  runtimeConfig: {
    public: {
      cdnUrl: process.env.CDN_URL,
      IMAGE_OPTIMIZER_DOMAIN: process.env.IMAGE_OPTIMIZER_DOMAIN,
    },
    jwt: process.env.JWT_TOKEN,
    credentials: {
      username: process.env.AUTH_USERNAME,
      password: process.env.AUTH_PASSWORD,
      accesscode: process.env.ACCESS_CODE,
    },
    r2: {
      bucketName: process.env.BUCKETNAME,
      baseUrl: process.env.ENDPOINT,
      accessKey: process.env.SECRETACCESSKEY,
      accessID: process.env.ACCESSKEYID,
      signatureVersion: process.env.SIGNATURE_VERSION,
    },
    db: {
      url: process.env.TURSO_DB_URL,
      token: process.env.TURSO_DB_TOKEN,
    },
  },
  modules: [
    "@nuxt/ui",
    "@vueuse/nuxt",
    "@nuxtjs/turnstile",
    "@sidebase/nuxt-auth",
  ],
  build: {
    transpile: ["uuid"],
  },
  app: {
    head: {
      htmlAttrs: {
        lang: "en",
      },
      title: "husbando",
      titleTemplate: "%s - Husbando.pics",
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        {
          hid: "description",
          name: "description",
          content: "The best place to find your fictional husbando...",
        },
        {
          hid: "og:title",
          property: "og:title",
          content: "Husbando.pics",
        },
        {
          hid: "og:description",
          property: "og:description",
          content: "The best place to find your fictional husbando...",
        },
        {
          hid: "og:image",
          property: "og:image",
          content: "/",
        },
        {
          hid: "og:type",
          property: "og:type",
          content: "website",
        },
        {
          hid: "og:url",
          property: "og:url",
          content: "",
        },
        {
          hid: "twitter:card",
          name: "twitter:card",
          content: "summary_large_image",
        },
        {
          hid: "twitter:title",
          name: "twitter:title",
          content: "Husbando.pics",
        },
        {
          hid: "twitter:description",
          name: "twitter:description",
          content: "The best place to find your fictional husbando...",
        },
        {
          hid: "twitter:image",
          name: "twitter:image",
          content: "/",
        },
      ],
    },
  },
  turnstile: {
    siteKey: process.env.TURNSTILE_SITE_KEY,
    secretKey: process.env.TURNSTILE_SECRET_KEY,
    addValidateEndpoint: true,
  },
  auth: {
    baseURL: process.env.AUTH_ORIGIN,
    session: {
      enableRefreshPeriodically: false,
      enableRefreshOnWindowFocus: false,
    },
  },
  routeRules: {
    "/api/list": {
      cors: true,
    },
    "/api/meta/**": {
      cors: true,
    },
    "/api/operation/**": {
      cors: true,
      headers: {
        "Access-Control-Allow-Origin": process.env.AUTH_ORIGIN || "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      },
    },
    "/api/upload": {
      cors: true,
      headers: {
        "Access-Control-Allow-Origin": process.env.AUTH_ORIGIN || "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      },
    },
    "/": { prerender: true },
    "/upload": { prerender: true },
  },
  experimental: {
    clientFallback: true,
  },
});