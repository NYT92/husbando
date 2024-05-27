<script setup lang="ts">
import type { NuxtError } from "#app";

const props = defineProps({
  error: Object as () => NuxtError,
});
</script>

<template>
  <NuxtLayout>
    <main
      class="grid min-h-full place-items-center px-6 py-24 sm:py-32 lg:px-8 text-white"
    >
      <div class="text-center">
        <p class="text-2xl font-bold text-green-600">{{ error?.statusCode }}</p>
        <h1
          class="mt-4 text-3xl font-bold tracking-tight sm:text-4xl"
        >
          {{ error?.message }}
        </h1>
        <div v-if="error?.statusCode === 404" class="flex flex-col gap-1 mt-6 text-base leading-7 text-white">
          <div class="flex flex-col">
            <UIcon class="size-16 col-1" name="i-heroicons-exclamation-circle-20-solid"></UIcon>
            <h3 class="text-xl font-semibold">Page not found</h3>
          </div>
          <ul class="list-disc text-base text-left pl-4">
            <li>Artist or Uploader requested for deletion</li>
            <li>Removed due to violation of our upload guideline</li>
            <li>Invalid URL</li>
          </ul>
        </div>
        <div v-if="error?.statusCode === 500">
          <div class="flex flex-col">
            <h3 class="text-xl font-semibold">Internal Error</h3>
            <p class="mt-2 text-base leading-7 text-white">
              We are sorry for the inconvenience. Please try again later.
            </p>
          </div>
        </div>
        <div class="mt-10 flex items-center justify-center gap-x-6">
          <UButton to="/" color="gray" size="xl">
            Go back
          </UButton>
        </div>
      </div>
    </main>
  </NuxtLayout>
</template>