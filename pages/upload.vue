<script setup>
import { genRanHex, husbandoTags } from "../utils";

useSeoMeta({
  title: "Upload",
  description: "Upload your fictional husbando here...",
  ogTitle: "Upload - Husbando.pics",
  ogDescription: "Upload your fictional husbando here...",
  ogImage: "",
  ogUrl: "",
  twitterTitle: "Upload - Husbando.pics",
  twitterDescription: "The best place to find your fictional husbando...",
  twitterImage: "",
  twitterCard: "summary",
});

useHead({
  htmlAttrs: {
    lang: "en",
  },
});

function formatFileSize(size) {
  if (size === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(size) / Math.log(k));
  return parseFloat((size / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

const file = ref(null);
const imagePreview = ref();
const isDragging = ref(false);
const loadingWhenUpload = ref(false);
const progressbar = ref(0);
const openModal = ref(false);
const modalTitle = ref("");
const modalContent = ref();
const ifImgDone = ref(false);
const imgDataResp = ref();
const turnstile = ref();
const cftsval = ref();

let fd = new FormData();

const formData = ref({
  selectedTags: [],
  source: "",
  isNsfw: false,
  isPublic: true,
  file: null,
  width: 0,
  height: 0,
});

const filteredHusbandoTags = computed(() => {
  return husbandoTags.sort().map((id) => ({
    value: id,
    name: (id.charAt(0).toUpperCase() + id.slice(1)).replace(/_/g, " "),
  }));
});

const handleDragOver = () => {
  isDragging.value = true;
};

const handleDragLeave = () => {
  isDragging.value = false;
};

const handleDrop = (event) => {
  isDragging.value = false;
  handleFile(event.dataTransfer.files);
};

const handlePasteImage = async (event) => {
  const items = (event.clipboardData || event.originalEvent.clipboardData)
    .items;
  for (const index in items) {
    const item = items[index];
    if (item.kind === "file") {
      const blob = item.getAsFile();
      const reader = new FileReader();
      reader.onload = () => {
        imagePreview.value = reader.result;
        const img = new Image();
        img.onload = function () {
          const width = img.width;
          const height = img.height;
          formData.width = width;
          formData.height = height;
          fd.append("width", width);
          fd.append("height", height);
        };
        img.src = reader.result;
      };
      reader.readAsDataURL(blob);
      file.value = blob;
      if (file_extension(blob.name).includes("gif")) {
        formData.selectedTags.push("gif");
      }
    }
  }
};

const handleFileUpload = (event) => {
  handleFile(event.target.files);
  formData.value.file = event.target.files[0];
};

const handleFile = (files) => {
  file.value = files[0];
  if (file_extension(files[0].name).includes("gif")) {
    formData.selectedTags.push("gif");
  }
  const reader = new FileReader();
  reader.onload = () => {
    imagePreview.value = reader.result;
    const img = new Image();
    img.onload = function () {
      const width = img.width;
      const height = img.height;
      formData.value.width = width;
      formData.value.height = height;
      fd.append("width", width);
      fd.append("height", height);
    };
    img.src = reader.result;
  };
  reader.readAsDataURL(file.value);

  return files[0];
};

async function submitForm(event) {
  loadingWhenUpload.value = true;

  const { data: cfResp } = await useFetch("/api/cfvalidation", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: {
      token: cftsval.value,
    },
  });

  if (!file.value) {
    modalTitle.value = "Error";
    modalContent.value = "Please upload the file first";
    openModal.value = true;
  }

  if (file.value.size > 15728640) {
    modalTitle.value = "Error";
    modalContent.value = "File size is too big (Max 15MB)";
    openModal.value = true;
  }

  if (formData.value.source.length > 0) {
    if (!formData.value.source.includes("https://")) {
      modalTitle.value = "Error";
      modalContent.value = "Source must be a valid URL";
      openModal.value = true;
    }
  }

  if (!formData.value.selectedTags.length > 0) {
    modalTitle.value = "Error";
    modalContent.value = "Please select at least one tag";
    openModal.value = true;
  }

  if (!cfResp.value.success) {
    modalTitle.value = "Error";
    modalContent.value = "Captcha validation failed";
    openModal.value = true;
    loadingWhenUpload.value = false;
  }

  fd.append("file", formData.value.file);
  fd.append("source", formData.value.source);
  fd.append("isNsfw", formData.value.isNsfw);
  fd.append("public", formData.value.isPublic);
  fd.append("tags", formData.value.selectedTags.join(","));

  const { data, error } = await useFetch("/api/upload", {
    method: "POST",
    body: fd,
  });

  if (error.value || !data.value.success || !data.value) {
    modalTitle.value = "Error";
    modalContent.value = "Something went wrong.. Please try again";
    openModal.value = true;
    progressbar.value = 0;
    loadingWhenUpload.value = false;
    fd.delete("file");
    fd.delete("source");
    fd.delete("isNsfw");
    fd.delete("public");
    fd.delete("tags");
    fd.delete("width");
    fd.delete("height");
    fd.delete("cptcha");
    fd.delete("tags");
  } else {
    progressbar.value = 100;
    ifImgDone.value = true;
    imgDataResp.value = data.value.body;
  }
}
</script>
<template>
  <UModal v-model="openModal">
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
            {{ modalTitle }}
          </h3>
          <UButton
            color="gray"
            variant="ghost"
            icon="i-heroicons-x-mark-20-solid"
            class="-my-1"
            @click="openModal = false"
          />
        </div>
      </template>
      {{ modalContent }}
    </UCard>
  </UModal>
  <UContainer>
    <section v-if="!ifImgDone">
      <div class="py-6">
        <h1 class="font-bold text-2xl">
          Upload your husband picture {{ `:)` }}
        </h1>
        <UAlert class="my-2" title="Upload Guidelines">
          <template #description>
            <p>
              By using our services, you must comply with the guidelines such
              as:
            </p>
            <ul
              class="list-disc list-inside text-gray-200 flex flex-col gap-1 py-1"
            >
              <li>OBVIOUSLY DO NOT UPLOAD WAIFU IMAGE. (USE waifu.pics)</li>
              <li>
                Upload the art that are OK by artists as long as they ask you to
                put credit or origin.
              </li>
              <li>You can only upload up to 15MB of images or gifs.</li>
              <li>
                Do not upload R-18 shota, illegal IRL media, meme, hate speech
                and gore.
              </li>
              <li>
                All images must be marked as NSFW if they contain as follows:
              </li>
              <ul class="list-disc list-inside text-gray-200 ml-5">
                <li>Naked body</li>
                <li>Sex-related</li>
                <li>Showing penis/asshole</li>
                <li>Lightsaber/Mosaic/Blur censorship</li>
              </ul>
              <li>
                If your art have been upload here without permission, send us an
                email at <UKbd size="md">husbando@skiff.com</UKbd> by attaching
                image ID & Source and good reason for us to remove from the
                website.
              </li>
              <li>
                You must include at least one tag when uploading. If there is no
                tag that fit the image or gif, find an alternative or wait for
                us to include more tag.
              </li>
            </ul>
            <i>
              If you don't follows any of these rules, you can get block by us
              from using the services because each upload contain
              <b>IP address</b> that we can use to track the origin.
            </i>
          </template>
        </UAlert>
      </div>
      <UForm
        class="pb-10 gap-5 flex flex-col"
        :state="formData"
        @submit="submitForm"
      >
        <UProgress
          id="progress"
          v-if="loadingWhenUpload"
          :value="progressbar"
        />

        <UFormGroup label="Upload image" name="file" required="">
          <div
            class="mt-2 flex justify-center rounded-lg border border-dashed border-gray-400/25 px-6 py-10"
            @dragover.prevent="handleDragOver"
            @dragleave.prevent="handleDragLeave"
            @drop.prevent="handleDrop"
            @paste="handlePasteImage"
            :class="{ 'border-green-600': isDragging }"
          >
            <div class="text-center">
              <div v-if="file">
                <img
                  v-if="imagePreview"
                  :src="imagePreview"
                  alt="Image Preview"
                  class="mx-auto w-64 object-cover rounded-lg mb-4"
                />
                <p class="text-sm leading-6 text-gray-500 mt-4">
                  File Name: {{ file.name }}
                </p>
                <p class="text-sm leading-6 text-gray-500">
                  File Size: {{ formatFileSize(file.size) }}
                </p>
                <label
                  for="file-upload"
                  class="relative cursor-pointer rounded-md font-semibold text-green-600 hover:text-green-500"
                >
                  <span>Upload file again?</span>
                  <input
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    class="sr-only"
                    :disabled="loadingWhenUpload"
                    @change="handleFileUpload"
                  />
                </label>
              </div>
              <div v-else>
                <Icon name="heroicons:arrow-up-tray" size="35px" />
                <div class="mt-4 flex text-sm leading-6 text-gray-400">
                  <label
                    for="file-upload"
                    class="relative cursor-pointer rounded-md font-semibold text-green-600 hover:text-green-500"
                  >
                    <span>Upload a file</span>
                    <input
                      id="file-upload"
                      name="file-upload"
                      type="file"
                      class="sr-only"
                      :disabled="loadingWhenUpload"
                      @change="handleFileUpload"
                    />
                  </label>
                  <p class="pl-1">or drag and drop</p>
                </div>
                <p class="text-xs leading-5 text-gray-400">
                  PNG, JPG, GIF up to 15MB
                </p>
              </div>
            </div>
          </div>
        </UFormGroup>

        <UFormGroup label="Tags" name="tags" required="">
          <USelectMenu
            v-model="formData.selectedTags"
            :options="filteredHusbandoTags"
            :disabled="loadingWhenUpload"
            option-attribute="name"
            value-attribute="value"
            multiple
            placeholder="Add tags"
            size="xl"
          >
            <template #label>
              <span v-if="formData.selectedTags?.length" class="truncate">{{
                formData.selectedTags?.join(", ")
              }}</span>
              <span v-else>Add tags</span>
            </template>
          </USelectMenu>
        </UFormGroup>

        <UFormGroup label="NSFW" name="isNsfw">
          <UToggle
            v-model="formData.isNsfw"
            :disabled="loadingWhenUpload"
            size="xl"
          />
          <br />
          <span class="my-1" v-if="formData.isNsfw">
            Make sure the image contained nudity
          </span>
        </UFormGroup>

        <UFormGroup label="List publicly?" name="isPublic">
          <UToggle
            v-model="formData.isPublic"
            :disabled="loadingWhenUpload"
            size="xl"
            on-icon="i-heroicons-globe-alt"
            off-icon="i-heroicons-lock-closed"
          />
          <div class="my-1">
            <span v-if="formData.isPublic">
              ⚠ This will be listed on public Homepage & API list
            </span>
            <span v-else-if="!formData.isPublic">
              ⚠ This will not be listed on Homepage list, but still can be
              access from the page & API.
            </span>
          </div>
        </UFormGroup>

        <UFormGroup label="Source (Optional)" name="source">
          <UInput
            v-model="formData.source"
            :disabled="loadingWhenUpload"
            placeholder="Source (Will use saucenao as the source if you don't provide it)"
            size="xl"
          />
        </UFormGroup>

        <UFormGroup label="Captcha" name="cptcha">
          <NuxtTurnstile ref="turnstile" v-model="cftsval" />
        </UFormGroup>

        <UButton
          size="xl"
          icon="i-heroicons-arrow-small-right"
          type="submit"
          :loading="loadingWhenUpload"
        >
          Submit
        </UButton>
      </UForm>
    </section>
    <section v-else>
      <UContainer class="my-5">
        <h1 class="font-bold text-2xl text-center">
          Image has been uplodaded!
        </h1>
        <p class="text-center">
          Your image has been uploaded successfully! You can view the image by
          clicking the button below.
        </p>
        <div class="max-w-md mx-auto my-5 rounded-md shadow-md p-4">
          <div>
            <img
              :src="imagePreview"
              alt="Image"
              class="w-full h-auto rounded-md mb-4"
            />
          </div>
          <div class="flex flex-col gap-4">
            <UButton
              color="green"
              icon="i-heroicons-arrow-top-right-on-square"
              :to="`/view/${imgDataResp?.id}`"
              size="xl"
            >
              View Image
            </UButton>
            <UButton
              to="/upload"
              :external="true"
              color="red"
              icon="i-tabler-arrow-back-up"
              href="/upload"
              size="xl"
            >
              Upload again?
            </UButton>
          </div>
        </div>
      </UContainer>
    </section>
  </UContainer>
</template>
