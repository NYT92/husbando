<script setup>
useSeoMeta({
  title: "Home",
  description: "The best place to find your fictional husbando...",
  ogTitle: "Home - Husbando.pics",
  ogDescription: "The best place to find your fictional husbando...",
  ogImage: "",
  ogUrl: "",
  twitterTitle: "Home - Husbando.pics",
  twitterDescription: "The best place to find your fictional husbando...",
  twitterImage: "",
  twitterCard: "summary",
});

useHead({
  htmlAttrs: {
    lang: "en",
  },
});

const route = useRoute();
const data = ref({ results: [] });
const offset = ref(0);
const limit = 30;
const isLoading = ref(false);
const hasMoreData = ref(true);

const fetchData = async () => {
  try {
    isLoading.value = true;
    const newData = await $fetch(
      `/api/list?offset=${offset.value}&limit=${limit}&show=${
        route.query.show || "not_nsfw"
      }`
    );

    if (newData.results.length === 0) {
      hasMoreData.value = false;
      return;
    }

    data.value.results = [...data.value.results, ...newData.results];
    offset.value += limit;
  } catch (error) {
    useToast().add({
      id: "error-fetching",
      title: "Error",
      description: "Error fetching data! Please refresh the page",
      icon: "i-heroicons-exclamation-circle",
      timeout: 5000,
    });
    console.error("Error fetching data:", error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchData();
  window.addEventListener("scroll", handleScroll);

  watch(
    () => route.query.show,
    () => {
      data.value.results = [];
      offset.value = 0;
      hasMoreData.value = true;
      fetchData();
    }
  );
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});

const handleScroll = () => {
  if (
    hasMoreData.value &&
    window.innerHeight + window.scrollY >= document.body.offsetHeight - 100 &&
    !isLoading.value
  ) {
    fetchData();
  }
};
</script>

<template>
  <ClientOnly>
    <div
      style="
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      "
      v-if="isLoading"
      class="loading"
    >
      <div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          xmlns:xlink="http://www.w3.org/1999/xlink"
          style="
            margin: auto;
            background: none;
            display: block;
            shape-rendering: auto;
          "
          width="100px"
          height="100px"
          viewBox="0 0 100 100"
          preserveAspectRatio="xMidYMid"
        >
          <circle
            cx="50"
            cy="50"
            fill="none"
            stroke="#ff312d"
            stroke-width="5"
            r="32"
            stroke-dasharray="150.79644737231007 52.26548245743669"
          >
            <animateTransform
              attributeName="transform"
              type="rotate"
              repeatCount="indefinite"
              dur="1s"
              values="0 50 50;360 50 50"
              keyTimes="0;1"
            ></animateTransform>
          </circle>
        </svg>

        <UButton
          v-if="hasMoreData"
          @click="fetchData"
          color="gray"
          variant="ghost"
          class="w-full"
          :disabled="isLoading"
          size="xl"
          block
        >
          Load more?
        </UButton>
      </div>
    </div>
    <div id="photos" class="pb-5">
      <NuxtLink
        v-for="image in data.results.filter((item) => item.public === true)"
        :key="image"
        :to="'/view/' + image.id.split('.')[0]"
      >
        <img
          :src="
            useRuntimeConfig().public.IMAGE_OPTIMIZER_DOMAIN
              ? `https://${useRuntimeConfig().public.IMAGE_OPTIMIZER_DOMAIN}/${
                  image.id
                }.${image.file_extension}`
              : image.url
          "
          :alt="image.id"
        />
      </NuxtLink>
    </div>
  </ClientOnly>
</template>

<style>
/* this css code style is taken from waifu.pics github repo */
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
