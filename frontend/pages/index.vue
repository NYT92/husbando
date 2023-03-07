<script setup>
const data = ref([]);
const showLoading = ref(true);
const route = useRoute();
const rtcfg = useRuntimeConfig();

let boolq
if (route.query.nsfw === "true") {
  boolq = true
} else {
  boolq = false
}

setTimeout(async () => {
  data.value = await $fetch(`${rtcfg.public.Api_url}/api/v1/husbando/list`, {
    method: "POST",
    body: {
      "is_nsfw": boolq,
    },
  })
  showLoading.value = false;
}, 1500);

definePageMeta({ auth: false });
</script>
<template>
  <ClientOnly>
    <div style="position:absolute;top:50%;left:50%;transform:translate(-50%, -50%);" v-if="showLoading" class="loading">
      <v-progress-circular size="50" indeterminate color="primary"></v-progress-circular>
    </div>
    <div id="photos">
      <NuxtLink
        v-for="image in data.data"
        :key="image"
        :to="'/view/' + image.id.split('.')[0]"
      >
        <img :src="image.url" />
      </NuxtLink>
    </div>
  </ClientOnly>
</template>
<style>
/* this css code style is taken from waifu.pics */
#photos {
  line-height: 0;
  -webkit-column-count: 5;
  -webkit-column-gap: 0px;
  -moz-column-count: 5;
  -moz-column-gap: 0px;
  column-count: 5;
  column-gap: 0px;
}
#photos img {
  width: 100% !important;
  height: auto !important;
}
@media (max-width: 1200px) {
  #photos {
    -moz-column-count: 4;
    -webkit-column-count: 4;
    column-count: 4;
  }
}
@media (max-width: 1000px) {
  #photos {
    -moz-column-count: 3;
    -webkit-column-count: 3;
    column-count: 3;
  }
}
@media (max-width: 800px) {
  #photos {
    -moz-column-count: 2;
    -webkit-column-count: 2;
    column-count: 2;
  }
}
@media (max-width: 400px) {
  #photos {
    -moz-column-count: 1;
    -webkit-column-count: 1;
    column-count: 1;
  }
}
</style>
