<script setup>
const { data, error } = await useFetch(`/api/meta/${useRoute().params.id}`);

useSeoMeta({
  title: `${data.value.id}.${data.value.file_extension}`,
  description: "The best place to find your fictional husbando...",
  ogTitle: `${data.value.id}.${data.value.file_extension}`,
  ogDescription: "The best place to find your fictional husbando...",
  ogImage: "",
  ogUrl: "",
  twitterTitle: `${data.value.id}.${data.value.file_extension}`,
  twitterDescription: "The best place to find your fictional husbando...",
  twitterImage: "",
  twitterCard: "summary",
});

useHead({
  htmlAttrs: {
    lang: "en",
  },
});

if (error.value) {
  if (error.value?.statusCode == 404) {
    throw createError({
      statusCode: 404,
      statusMessage: "Not found",
    });
  }
  if (error.value?.response.status == 500) {
    throw createError({
      statusCode: 500,
      statusMessage: "Internal server error",
    });
  }
}

const splr = ref(true);
const viewBiggerImg = ref(false);
const openFormModal = ref(false);

const revealSpoiler = () => {
  const spoilerCover = document.querySelector(".spoiler-cover");
  spoilerCover.style.display = "none";
  splr.value = false;
};

const setIcon = (url) => {
  if (url) {
    if (url.includes("twitter")) return "i-tabler-brand-twitter";
    if (url.includes("instagram")) return "i-tabler-brand-instagram";
    if (url.includes("facebook")) return "i-tabler-brand-facebook";
    if (url.includes("pixiv")) return "i-tabler-letter-p";
    if (url.includes("danbooru")) return "i-tabler-letter-d";
  }
  return "i-heroicons-link-20-solid";
};
</script>
<template>
  <UModal v-model="viewBiggerImg" fullscreen>
    <UCard
      :ui="{
        base: 'h-full flex flex-col',
        rounded: '',
        divide: 'divide-y divide-gray-100 dark:divide-gray-800',
        body: {
          base: '',
          background: '',
          padding: 'p-0 sm:p-0 flex justify-center w-auto h-[100%]',
        },
        header: {
          base: '',
          background: '',
          padding: 'p-2',
        },
      }"
    >
      <template #header>
        <div class="flex items-center justify-between">
          <h3
            class="text-base font-semibold leading-6 text-gray-900 dark:text-white"
          >
            {{ data.id }}
          </h3>
          <UButton
            color="gray"
            variant="ghost"
            icon="i-heroicons-x-mark-20-solid"
            class="-my-1"
            @click="viewBiggerImg = false"
          />
        </div>
      </template>

      <img
        @click="viewBiggerImg = false"
        :src="data.url"
        alt="Image"
        class=""
      />
    </UCard>
  </UModal>
  <UModal v-model="openFormModal" fullscreen>
    <UCard
      :ui="{
        base: 'h-full flex flex-col',
        rounded: '',
        divide: 'divide-y divide-gray-100 dark:divide-gray-800',
        body: {
          base: '',
          background: '',
          padding: 'p-0 sm:p-0 flex justify-center w-auto h-[100%]',
        },
        header: {
          base: '',
          background: '',
          padding: 'p-4',
        },
      }"
    >
      <template #header>
        <div class="flex items-center justify-between">
          <h3
            class="text-base font-semibold leading-6 text-gray-900 dark:text-white"
          >
            Report Image : {{ data.id }}
          </h3>
          <UButton
            color="gray"
            variant="ghost"
            icon="i-heroicons-x-mark-20-solid"
            class="-my-1"
            @click="openFormModal = false"
          />
        </div>
      </template>
      <iframe
        class="w-full h-full"
        src="https://docs.google.com/forms/d/e/1FAIpQLSdQc04FIjCawIfNWj1S3kbh5L7E3GyTmBZ1Icl05lBGPiEN4A/viewform?embedded=true"
        frameborder="0"
        marginheight="0"
        marginwidth="0"
        >Loading…</iframe
      >
    </UCard>
  </UModal>
  <div class="max-w-md mx-auto my-5 rounded-md shadow-md p-4">
    <div v-if="!data.isNsfw">
      <img
        @click="viewBiggerImg = true"
        :src="data.url"
        alt="Image"
        class="w-full h-auto rounded-md mb-4"
      />
    </div>
    <div v-else>
      <img
        v-if="!splr"
        @click="viewBiggerImg = true"
        :src="data.url"
        alt="Image"
        class="w-full h-auto rounded-md mb-4"
      />
      <div class="spoiler-cover w-full h-[50vh]" @click="revealSpoiler">
        Click to reveal image
      </div>
    </div>
    <div class="py-4 flex flex-row justify-center gap-1">
      <UButton
        color="blue"
        :to="data.url"
        icon="i-heroicons-arrow-down-tray"
        size="lg"
        :download="data.id + data.file_extension"
        ref="_blank"
        rel="noopener noreferrer"
      >
        Download
      </UButton>
      <UButton
        color="yellow"
        icon="i-heroicons-arrow-top-right-on-square"
        :to="data.url"
        target="_blank"
        size="lg"
      >
        Full Image
      </UButton>
    </div>
    <hr class="hrstyle" />
    <span class="text-gray-100 font-semibold">Image information: </span>
    <hr class="hrstyle" />
    <article class="flex flex-col space-y-2">
      <div class="flex flex-row space-x-2">
        <span class="text-gray-200 font-semibold">ID:</span>
        <span class="text-gray-200">{{ data.id }}</span>
      </div>
      <div class="flex flex-row space-x-2 align-center items-center">
        <span class="text-gray-200 font-semibold">Source:</span>
        <UButton
          :to="
            data.source
              ? data.source
              : `https://saucenao.com/search.php?url=${data.url}`
          "
          target="_blank"
          :icon="setIcon(data.source)"
          :color="
            data.source.includes('twitter') || data.source.includes('pixiv')
              ? 'blue'
              : data.source.includes('patreon')
              ? 'orange'
              : 'gray'
          "
        >
          {{ data?.source ? "View Source" : "Saucenao" }}
        </UButton>
      </div>
      <div class="flex flex-row space-x-2">
        <span class="text-gray-200 font-semibold">File extension:</span>
        <span class="text-gray-200">{{ data?.file_extension }}</span>
      </div>
      <div class="flex flex-row space-x-2">
        <span class="text-gray-200 font-semibold">Image Size:</span>
        <span class="text-gray-200">{{ data.width }}x{{ data.height }}</span>
      </div>
      <div class="flex flex-row space-x-2">
        <span class="text-gray-200 font-semibold">Uploaded on:</span>
        <span class="text-gray-200">{{ data.uploaded_at }}</span>
      </div>
      <div class="flex flex-col mt-1">
        <span class="text-gray-200 font-semibold">Tags:</span> <br />
        <div class="mt-1 space-x-1 space-y-1">
          <UBadge
            v-for="tag in data.tags"
            :key="tag"
            color="primary"
            variant="outline"
            size="lg"
            :label="tag"
          />
        </div>
      </div>
    </article>
    <hr class="hrstyle" />
    <UButton
      @click="openFormModal = true"
      color="yellow"
      icon="i-heroicons-exclamation-triangle-20-solid"
      block
    >
      Report this image
    </UButton>
  </div>
</template>
<style>
.hrstyle {
  @apply my-2 border-gray-700 border-2 rounded;
}
.spoiler-cover {
  @apply bg-gray-900 text-gray-100 text-center rounded-md p-4 grid place-items-center;
}
</style>
