import vuetify from "vite-plugin-vuetify";

const title = "Husbando.pics";
const description =
  "Husbando.pics is the place where you post your favorites male characters...";
const image = "";
const url = process.env.NODE_ENV === "production" ? process.env.WEBSITE : "http://localhost:3000";

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  ssr: true,
  css: ["@/assets/main.scss"],
  build: {
    transpile: ["vuetify"],
  },
  vite: {
    ssr: {
      noExternal: ["vuetify"],
    },
    define: {
      "process.env.DEBUG": true,
    },
  },
  modules: [
    "nuxt-icon",
    "@sidebase/nuxt-auth",
    "@nuxtjs/turnstile",
    async (options, nuxt) => {
      nuxt.hooks.hook("vite:extendConfig", (config) =>
        // @ts-ignore
        config.plugins.push(vuetify())
      );
    },
  ],
  runtimeConfig: {
    Secret: process.env.SECRET,
    user: process.env.USER,
    pass: process.env.PASS,
    FORMATE_API_KEY: process.env.FORMATE_API_KEY,
    public: {
      FORMATE_URL: process.env.FORMATE_URL,
      Api_url: process.env.API_URL,
    }
  },
  // @ts-ignore
  turnstile: {
    siteKey: process.env.NUXT_TURNSTILE_SITE_KEY || "",
    secretKey: process.env.NUXT_TURNSTILE_SECRET_KEY || "",
  },
  auth: {
    isEnabled: true,
    origin: url,
    basePath: "/api/auth",
    enableSessionRefreshPeriodically: false,
    enableSessionRefreshOnWindowFocus: false,
    enableGlobalAppMiddleware: false,
    defaultProvider: undefined,
    globalMiddlewareOptions: { allow404WithoutAuth: true },
  },
  app: {
    head: {
      title: "Husbando.pics",
      titleTemplate: "%s | Husbando.pics",
      link: [
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap",
        },
        { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
        {
          rel: "canonical",
          href: url,
        },
      ],
      meta: [
        {
          hid: "description",
          name: "description",
          content: description,
        },
        { property: "og:site_name", content: title },
        { hid: "og:type", property: "og:type", content: "website" },
        {
          hid: "og:url",
          property: "og:url",
          content: url,
        },
        {
          hid: "og:image:secure_url",
          property: "og:image:secure_url",
          content: image,
        },
        {
          hid: "og:title",
          property: "og:title",
          content: title,
        },
        {
          hid: "og:description",
          property: "og:description",
          content: description,
        },
        {
          hid: "og:image",
          property: "og:image",
          content: image,
        },
        //Twitter
        { name: "twitter:card", content: "summary_large_image" },
        {
          hid: "twitter:url",
          name: "twitter:url",
          content: url,
        },
        {
          hid: "twitter:title",
          name: "twitter:title",
          content: title,
        },
        {
          hid: "twitter:description",
          name: "twitter:description",
          content: description,
        },
        {
          hid: "twitter:image",
          name: "twitter:image",
          content: image,
        },
      ],
    },
  },
});
