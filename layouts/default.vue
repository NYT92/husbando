<template>
  <UModal v-model="aboutPage">
    <UCard
      :ui="{
        ring: '',
        divide: 'divide-y divide-gray-100 dark:divide-gray-800',
      }"
    >
      <template #header>
        <div class="flex items-center justify-between">
          <h3
            class="text-base font-semibold leading-6 text-gray-900 dark:text-white"
          >
            About Husbando.pics
          </h3>
          <UButton
            color="gray"
            variant="ghost"
            icon="i-heroicons-x-mark-20-solid"
            class="-my-1"
            @click="aboutPage = false"
          />
        </div>
      </template>
      <h1 class="text-2xl font-bold pb-2">About</h1>
      <p class="text-gray-200">
        Husbando.pics is a free and open source image hosting website similar to
        waifu.pics but for men built with nuxt, @nuxt/ui, DrizzleORM, Cloudflare
        R2 and TursoDB.
      </p>
      <h1 class="text-2xl font-bold pb-2 mt-4">Features</h1>
      <ul class="list-disc list-inside text-gray-200">
        <li>Upload forms with Turnstile captcha</li>
        <li>Simple Admin dashboard</li>
        <li>View protection for NSFW image</li>
        <li>Custom image optimizer from other services</li>
      </ul>
      <h1 class="text-2xl font-bold pb-2 mt-4">Support</h1>
      <p class="text-gray-200">
        Husbando.pics is free for every yaoi or normal fan and providing high
        quality images. It would be great if you support my project just to keep
        this website stay up and running forever.
      </p>
      <UCard class="my-4">
        <blockquote class="space-y-2 text-gray-200">
          <i>
            "Even though I am not a gay person or anything but I still love and
            support also collectioning people artworks even Yaoi/Yuri arts
            because it is my passion." - NYT92
          </i>
        </blockquote>
      </UCard>
      <div class="flex">
        <UButton
          color="yellow"
          variant="ghost"
          class="my-2"
          to="https://github.com/sponsors/nyt92"
          target="_blank"
          size="lg"
        >
          <Icon name="i-akar-icons:github-fill" /> Sponsors @NYT92
        </UButton>
        <UButton
          color="orange"
          variant="ghost"
          class="my-2"
          to="https://ko-fi.com/nyt92"
          target="_blank"
          size="lg"
        >
          <Icon name="i-akar-icons:coffee" /> Ko-fi
        </UButton>
      </div>
      <div class="flex items-center justify-between mt-4">
        <UButton
          color="gray"
          class="-my-1"
          to="https://github.com/nyt92/husbando"
          target="_blank"
          size="lg"
        >
          <Icon name="i-akar-icons:github-fill" /> Github
        </UButton>
      </div>
    </UCard>
  </UModal>
  <header class="bg-gray-800">
    <nav
      class="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8"
      aria-label="Global"
    >
      <div class="flex lg:flex-1">
        <NuxtLink to="/" class="-m-1.5 p-1.5">
          <span class="sr-only">Husbando.pics</span>
          <UTooltip :text="isJune() ? 'so gay...' : 'Home'">
            <h1
              class="font-bold text-xl"
              :class="isJune() ? 'rainbow-text' : ''"
            >
              Husbando.pics
            </h1>
          </UTooltip>
        </NuxtLink>
      </div>
      <div class="flex lg:hidden">
        <button
          type="button"
          class="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-400"
          @click="mobileMenuOpen = true"
        >
          <span class="sr-only">Open main menu</span>
          <Icon name="heroicons:bars-3-20-solid" />
        </button>
      </div>
      <div class="hidden lg:flex lg:gap-x-12">
        <NuxtLink class="text-sm font-semibold leading-6 text-white" to="/">
          Home
        </NuxtLink>
        <NuxtLink
          class="text-sm font-semibold leading-6 text-white"
          to="/upload"
        >
          Upload
        </NuxtLink>
        <NuxtLink
          class="cursor-pointer text-sm font-semibold leading-6 text-white"
          @click="aboutPage = true"
        >
          About
        </NuxtLink>
      </div>
      <div class="hidden lg:flex lg:flex-1 lg:justify-end gap-4">
        <USelectMenu
          v-model="selectedFilter"
          @change="changeFilter"
          :options="showNsfwOptions"
          value-attribute="isNsfw"
          option-attribute="label"
        >
        </USelectMenu>
        <div class="flex items-center">
          <NuxtLink
            :to="`${status == 'authenticated' ? '/dashboard' : '/signin'}`"
            class="text-sm font-semibold leading-6 text-white"
          >
            {{ status == "authenticated" ? "Dashboard" : "For Admin" }}
            <span aria-hidden="true">&rarr;</span>
          </NuxtLink>
        </div>
      </div>
    </nav>
    <USlideover v-model="mobileMenuOpen">
      <div class="p-4 flex-1">
        <div class="flex items-center justify-between">
          <NuxtLink to="/" class="-m-1.5 p-1.5">
            <span class="sr-only">Husbando.pics</span>
            <h1
              class="font-bold text-xl"
              :class="isJune() ? 'rainbow-text' : ''"
            >
              Husbando.pics
            </h1>
          </NuxtLink>
          <button
            type="button"
            class="-m-2.5 rounded-md p-2.5 text-gray-400"
            @click="mobileMenuOpen = false"
          >
            <span class="sr-only">Close menu</span>
            <Icon name="heroicons:x-mark-20-solid" />
          </button>
        </div>
        <div class="mt-6 flow-root">
          <div class="-my-6 divide-y divide-gray-500/25">
            <div class="space-y-2 py-6">
              <NuxtLink
                class="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-white hover:bg-gray-800"
                to="/"
              >
                Home
              </NuxtLink>
              <NuxtLink
                class="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-white hover:bg-gray-800"
                to="/upload"
              >
                Upload
              </NuxtLink>
              <NuxtLink
                class="cursor-pointer -mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-white hover:bg-gray-800"
                @click="(aboutPage = true) && (mobileMenuOpen = false)"
              >
                About
              </NuxtLink>
            </div>
            <div class="py-6">
              <div class="my-2">
                <span class="text-lg font-semibold leading-6 text-white">
                  Filter:
                </span>
                <USelectMenu
                  class="my-2"
                  v-model="selectedFilter"
                  @change="changeFilter"
                  :options="showNsfwOptions"
                  value-attribute="isNsfw"
                  option-attribute="label"
                  size="lg"
                />
              </div>
              <NuxtLink
                :to="`${status == 'authenticated' ? '/dashboard' : '/signin'}`"
                class="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-white hover:bg-gray-800"
              >
                {{
                  status == "authenticated" ? "Dashboard" : "Sign in as Admin"
                }}
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </USlideover>
  </header>
  <div>
    <slot />
  </div>
</template>
<script setup>
import { useStorage } from "@vueuse/core";

const { status } = useAuth();
const aboutPage = ref(false);

const filterState = useStorage("filters", {
  label: "SFW",
  isNsfw: "false",
});

const showNsfwOptions = [
  {
    label: "SFW",
    isNsfw: "false",
  },
  {
    label: "NSFW",
    isNsfw: "true",
  },
  {
    label: "All",
    isNsfw: "all",
  },
];

const selectedFilter = ref(filterState?.value.isNsfw || "false");
const changeFilter = () => {
  filterState.value = showNsfwOptions.filter(
    (option) => option.isNsfw == selectedFilter.value
  )[0];
};

const mobileMenuOpen = ref(false);

const isJune = () => {
  const date = new Date();
  return date.getMonth() == 5;
};
</script>
<style>
.rainbow-text {
  background: linear-gradient(
    90deg,
    #c0382b,
    #f39c19,
    #f2c511,
    #2ecc70,
    #2980b9,
    #8e43ad
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>
