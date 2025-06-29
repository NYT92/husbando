<script setup>
useSeoMeta({
  title: "Dashboard",
  description: "The best place to find your fictional husbando...",
});

useHead({
  htmlAttrs: {
    lang: "en",
  },
});

definePageMeta({ middleware: "sidebase-auth" });

const { signOut, status, data } = useAuth();
const onsubmit = ref(false);
const table_q = ref("");
const editDialog = ref(false);

const tab_items = [
  {
    key: "list",
    label: "All Images",
    description: "List of all images uploaded by users.",
  },
  {
    key: "account",
    label: "Account",
    description: "Change and check your account information.",
  },
];

const columns = [
  { label: "ID", key: "id" },
  { label: "Tags", key: "tags" },
  { label: "NSFW", key: "isNsfw", sortable: true },
  { label: "Visiblity", key: "public", sortable: true },
  { label: "File extension", key: "file_extension" },
  { label: "Size", key: "imgSize" },
  { label: "Uploaded", key: "uploaded_at", sortable: true },
  { label: "IP", key: "ip" },
  { key: "actions" },
];

const items = (row) => [
  [
    {
      label: "Edit",
      icon: "i-heroicons-pencil-square-20-solid",
      click: () => editMeta(row),
    },
  ],
  [
    {
      label: "Download/View",
      icon: "i-heroicons-arrow-top-right-on-square",
      click: () => navigateTo(`${row.url}`, { external: true, open: true }),
    },
    {
      label: "View page",
      icon: "i-heroicons-link-20-solid",
      click: () =>
        navigateTo(`/view/${row.id}`, { external: true, open: true }),
    },
  ],
  [
    {
      label: "Delete",
      icon: "i-heroicons-trash-20-solid",
      click: () => deleteImage(row.id, row.file_extension),
    },
  ],
];
const selectedColumns = ref(columns);
const page = ref(1);
const pageCount = ref(20);
const dataTable = ref({
  offset: 0,
  limit: 20,
});

let h_data = ref(null);

async function fetchData(offset, cache = "force-cache") {
  const data = await $fetch("/api/list", {
    params: {
      offset: offset,
      limit: dataTable.value.limit,
    },
    mode: "cors",
    cache,
  });
  return data;
}

const refreshList = async () => {
  h_data.value = await fetchData(0, "default");
};

const pageFrom = computed(() => (page.value - 1) * pageCount.value + 1);
const pageTo = computed(() =>
  Math.min(page.value * pageCount.value, h_data.value.info.total)
);

watch(page, async (newPage) => {
  dataTable.value.offset = (newPage - 1) * dataTable.value.limit;
  h_data.value = await fetchData(dataTable.value.offset);
});

h_data.value = await fetchData(0);

const filteredRows = computed(() => {
  if (!h_data.value?.results) return [];

  if (!table_q.value) {
    return h_data.value.results;
  }

  return h_data.value.results.filter((data) => {
    return Object.values(data).some((value) => {
      return String(value).toLowerCase().includes(table_q.value.toLowerCase());
    });
  });
});

const currentData = reactive({
  selectedTags: [],
  source: "",
  isNsfw: undefined,
  isPublic: undefined,
  info: {
    id: "",
    ip: "",
    file_extension: "",
    width: "",
    height: "",
    uploaded_at: "",
  },
});

const editMeta = (row) => {
  editDialog.value = true;
  currentData.selectedTags = row.tags;
  currentData.source = row.source;
  currentData.isNsfw = row.isNsfw;
  currentData.isPublic = row.public;
  currentData.info = {
    id: row.id,
    ip: row.ip,
    file_extension: row.file_extension,
    width: row.width,
    height: row.height,
    uploaded_at: row.uploaded_at,
    url: row.url,
  };
};

const updateMeta = async () => {
  try {
    onsubmit.value = true;
    await useFetch(`/api/operation/update`, {
      method: "PUT",
      body: {
        id: currentData.info.id,
        tags: currentData.selectedTags,
        source: currentData.source,
        isNsfw: currentData.isNsfw,
        public: currentData.isPublic,
      },
    });
    alert("Updated!");
    editDialog.value = false;
    onsubmit.value = false;
    refreshList();
  } catch (error) {
    alert("Something went wrong!");
    onsubmit.value = false;
  }
};

const deleteImage = async (id, file_extension) => {
  if (confirm("Are you sure you want to delete this image?")) {
    try {
      await useFetch(`/api/operation/delete`, {
        method: "DELETE",
        body: {
          id,
          file_extension,
        },
      });
      alert("Deleted!");
      refreshList();
    } catch (error) {
      alert("Something went wrong!");
    }
  }
};
</script>

<template>
  <UTabs :items="tab_items" class="w-full py-4 px-auto lg:px-4">
    <template #item="{ item }">
      <div v-if="item.key === 'list'">
        <UModal v-model="editDialog" prevent-close="">
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
                  Edit Image Metadata
                </h3>
                <UButton
                  color="gray"
                  variant="ghost"
                  icon="i-heroicons-x-mark-20-solid"
                  class="-my-1"
                  @click="editDialog = false"
                />
              </div>
            </template>

            <div class="flex flex-col gap-4 p-4">
              <div>
                <img
                  :src="currentData.info.url"
                  alt="Image"
                  class="w-full h-auto rounded-md mb-4"
                />
              </div>
              <div class="flex flex-row space-x-2">
                <span class="text-gray-200 font-semibold">ID:</span>
                <span class="text-gray-200">{{ currentData.info.id }}</span>
              </div>
              <div class="flex flex-row space-x-2">
                <span class="text-gray-200 font-semibold">File extension:</span>
                <span class="text-gray-200">{{
                  currentData.info.file_extension
                }}</span>
              </div>
              <div class="flex flex-row space-x-2">
                <span class="text-gray-200 font-semibold">Image Size:</span>
                <span class="text-gray-200"
                  >{{ currentData.info.width }}x{{
                    currentData.info.height
                  }}</span
                >
              </div>
              <div class="flex flex-row space-x-2">
                <span class="text-gray-200 font-semibold">Upload on:</span>
                <span class="text-gray-200">{{
                  currentData.info.uploaded_at
                }}</span>
              </div>
              <UForm class="gap-5 flex flex-col" @submit="updateMeta">
                <UFormGroup label="Tags" name="tags" required="">
                  <USelectMenu
                    v-model="currentData.selectedTags"
                    :options="husbandoTags"
                    multiple
                    placeholder="Add tags"
                    size="xl"
                  >
                    <template #label>
                      <span
                        v-if="currentData.selectedTags.length"
                        class="truncate"
                        >{{ currentData.selectedTags.join(", ") }}</span
                      >
                      <span v-else>Add tags</span>
                    </template>
                  </USelectMenu>
                </UFormGroup>

                <UFormGroup label="NSFW" name="isNsfw">
                  <UToggle v-model="currentData.isNsfw" size="xl" />
                </UFormGroup>

                <UFormGroup label="Set Visiblity" name="isPublic">
                  <UToggle
                    v-model="currentData.isPublic"
                    size="xl"
                    on-icon="i-heroicons-globe-alt"
                    off-icon="i-heroicons-lock-closed"
                  />
                </UFormGroup>

                <UFormGroup label="Source" name="source">
                  <UInput
                    v-model="currentData.source"
                    placeholder="Source"
                    size="xl"
                  />
                </UFormGroup>

                <UButton
                  size="xl"
                  icon="i-heroicons-arrow-small-right"
                  type="submit"
                  :disabled="onsubmit"
                >
                  Save
                </UButton>
              </UForm>
            </div>
          </UCard>
        </UModal>
        <UCard class="h-full">
          <div class="flex gap-4">
            <UInput
              size="xl"
              v-model="table_q"
              placeholder="Search"
              icon="i-heroicons-magnifying-glass-16-solid"
            />
            <USelectMenu
              v-model="selectedColumns"
              :options="columns"
              size="xl"
              multiple
              placeholder="Columns"
            />
            <div>
              <UButton
                size="xl"
                icon="i-heroicons-arrow-path-rounded-square"
                type="submit"
                @click="refreshList"
              >
                Reload
              </UButton>
            </div>
          </div>
          <ClientOnly>
            <UTable :columns="selectedColumns" :rows="filteredRows">
            <template #tags-data="{ row }">
              <div class="flex flex-row space-x-2">
                <UBadge
                  v-for="tag in row.tags"
                  :key="tag"
                  class="mr-1"
                  color="primary"
                  variant="outline"
                  size="sm"
                  :label="tag"
                />
              </div>
            </template>
            <template #imgSize-data="{ row }">
              <span>{{ `${row.width}x${row.height}` }}</span>
            </template>
            <template #actions-data="{ row }">
              <UDropdown :items="items(row)">
                <UButton
                  color="gray"
                  variant="ghost"
                  icon="i-heroicons-ellipsis-horizontal-20-solid"
                />
              </UDropdown>
            </template>
          </UTable>
          <UDivider class="my-4" />
          <div class="flex flex-wrap justify-between items-center">
            <div>
              <span class="text-sm leading-5">
                Showing
                <span class="font-medium">{{ pageFrom }}</span>
                to
                <span class="font-medium">{{ pageTo }}</span>
                of
                <span class="font-medium">{{ h_data?.info?.total }}</span>
                results
              </span>
            </div>
            <UPagination
              v-model="page"
              :page-count="pageCount"
              :total="h_data.info.total"
            />
          </div>
          </ClientOnly>
        </UCard>
      </div>
      <div v-else-if="item.key === 'account'" class="space-y-3">
        <UCard>
          <template #header>
            <h3
              class="text-base font-semibold leading-6 text-gray-900 dark:text-white"
            >
              Account
            </h3>
          </template>
          <div class="flex flex-row gap-4">
            <UAvatar
              size="lg"
              src="https://api.dicebear.com/5.x/fun-emoji/svg?seed=admin"
              alt="Avatar"
            />
            <div>
              <h3
                class="text-base font-semibold leading-6 text-gray-900 dark:text-white"
              >
                User : {{ data.user.name }}
              </h3>
              <p>Status: {{ status }}</p>
              <p>Expired in: {{ new Date(data.expires) }}</p>
            </div>
          </div>
          <template #footer>
            <UButton @click="signOut" color="red">Log out</UButton>
          </template>
        </UCard>
      </div>
    </template>
  </UTabs>
</template>
