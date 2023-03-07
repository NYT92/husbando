<script setup>
const qroute = useRoute().query;
const drawer = ref(null);
const items_nav_drawer = ref([
  {
    title: qroute.nsfw === "true" ? "SFW" : "NSFW",
    value: 1,
    props: {
      href: "/?nsfw=" + (qroute.nsfw === "true" ? "false" : "true"),
      prependIcon:
        qroute.nsfw === "true"
          ? "mdi-image-outline"
          : "mdi-image-off-outline",
    },
  },
  {
    title: "Upload",
    value: 2,
    props: {
      to: "/upload",
      prependIcon: "mdi-upload",
    },
  },
  {
    title: "Admin",
    value: 3,
    props: {
      to: "/admin",
      prependIcon: "mdi-account-group",
    },
  },
  {
    title: "Docs",
    value: 4,
    props: {
      to: "/docs",
      prependIcon: "mdi-book-open-outline",
    },
  },
]);
</script>

<template>
  <v-app>
    <v-app-bar>
      <v-toolbar-title>
        <NuxtLink to="/"> husbando(BETA) </NuxtLink>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-app-bar-nav-icon
        variant="text"
        @click.stop="drawer = !drawer"
      ></v-app-bar-nav-icon>
    </v-app-bar>
    <v-navigation-drawer v-model="drawer" >
      <v-list :items="items_nav_drawer" />
    </v-navigation-drawer>

    <v-main style="min-height: 100vh">
      <slot />
    </v-main>
    <v-footer height="10px">
      <p>{{ new Date().getFullYear() }} © NYT92/nsdev. Made with 💀!!!</p>
      <v-spacer></v-spacer>
      <v-btn to="/docs">
        <v-icon class="mr-1"> mdi-book-open-outline </v-icon>
        DOCS
      </v-btn>
    </v-footer>
  </v-app>
</template>
