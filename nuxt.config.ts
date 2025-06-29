// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  css: ["~/assets/style.css"],

  runtimeConfig: {
    public: {
      cdnUrl: process.env.CDN_URL,
      IMAGE_OPTIMIZER_DOMAIN: process.env.IMAGE_OPTIMIZER_DOMAIN,
    },
    authOrigin: process.env.AUTH_ORIGIN,
    jwt: process.env.JWT_TOKEN,
    credentials: {
      username: process.env.AUTH_USERNAME,
      password: process.env.AUTH_PASSWORD,
      accesscode: process.env.ACCESS_CODE,
    },
    r2: {
      bucketName: process.env.BUCKETNAME,
      baseUrl: process.env.ENDPOINT,
      secretAccessKey: process.env.SECRETACCESSKEY,
      accessKeyId: process.env.ACCESSKEYID,
      signatureVersion: process.env.SIGNATURE_VERSION,
    },
    db: {
      url: process.env.TURSO_DB_URL,
      token: process.env.TURSO_DB_TOKEN,
    },
    turnstile: {
      secretKey: process.env.TURNSTILE_SECRET_KEY,
    },
  },

  modules: [
    "@nuxt/ui",
    "@vueuse/nuxt",
    "@sidebase/nuxt-auth",
    "@nuxtjs/turnstile",
    "@nuxt/image",
    "@nuxt/scripts",
  ],

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
          name: "description",
          content: "The best place to find your fictional husbando...",
        },
        {
          name: "og:title",
          property: "og:title",
          content: "Husbando.pics",
        },
        {
          name: "og:description",
          property: "og:description",
          content: "The best place to find your fictional husbando...",
        },
        {
          name: "og:image",
          property: "og:image",
          content: "/",
        },
        {
          name: "og:type",
          property: "og:type",
          content: "website",
        },
        {
          name: "og:url",
          property: "og:url",
          content: "",
        },
        {
          property: "twitter:card",
          name: "twitter:card",
          content: "summary_large_image",
        },
        {
          property: "twitter:title",
          name: "twitter:title",
          content: "Husbando.pics",
        },
        {
          property: "twitter:description",
          name: "twitter:description",
          content: "The best place to find your fictional husbando...",
        },
        {
          property: "twitter:image",
          name: "twitter:image",
          content: "/",
        },
      ],
    },
  },

  turnstile: {
    siteKey: process.env.TURNSTILE_SITE_KEY,
  },

  colorMode: {
    preference: "dark",
  },

  image: {
    provider: process.env.IMAGE_OPTIMIZER_DOMAIN ? "coollabsImage" : "none",
    providers: {
      coollabsImage: {
        provider: "~/providers/coollabsImage",
        options: {
          baseURL: process.env.IMAGE_OPTIMIZER_DOMAIN,
        },
      },
    },
  },

  auth: {
    isEnabled: true,
    disableServerSideAuth: false,
    originEnvKey: "AUTH_ORIGIN",
    provider: {
      type: "authjs",
    },
    sessionRefresh: {
      enablePeriodically: false,
      enableOnWindowFocus: true,
    },
    globalAppMiddleware: {
      isEnabled: false,
      addDefaultCallbackUrl: true,
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
    "/": {
      prerender: true,
    },
    "/upload": {
      prerender: true,
    },
  },

  experimental: {
    clientFallback: true,
  },

  compatibilityDate: "2025-02-18",
});