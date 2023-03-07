<script setup>
definePageMeta({ middleware: "auth" });
useHead({
  title: "Admin dashboard",
});
const tab = ref(null);
const { status, data: userData, signOut } = useSession();
const headers = useRequestHeaders(["cookie"]);
const { data: token } = await useFetch("/api/token", { headers });
// save the signtkn to localstorage
if (process.client) {
  localStorage.setItem("app_token_husbando_auth", token.value.signtkn);
}

const items = ref([
  "man",
  "boy",
  "shota",
  "muscle",
  "trap",
  "neko",
  "bunny",
  "furry",
  "kiss",
  "gif",
  "dark_skin",
  "high_school",
  "hug",
  "love",
  "prostitute",
  "anal",
  "ass",
  "boobs",
  "bdsm",
  "blowjob",
  "gangbang",
  "creampie",
  "cumshot",
  "big_breasts",
  "large_penis",
  "peeled_foreskin",
  "threesome",
  "foursome",
  "masturbate",
  "paizuri",
  "naked",
]);

const { data: i_dbdata, refresh } = await useFetch(
  `https://api.husbando.pics/api/v1/husbando/list`,
  {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token.value.signtkn}`,
    },
    lazy: true,
  }
);

const showLoading = ref(true);
const dbtable = ref(false);
setTimeout(async () => {
  dbtable.value = true;
  showLoading.value = false;
}, 1500);

const img_id = ref("");
const img_src = ref("");
const viewimg_dialog = ref(false);
const edit_dialog = ref(false);
const disableForm = ref(false);

const deleteitem = async (id) => {
  await useFetch(`https://api.husbando.pics/api/file/hdodelete`, {
    method: "POST",
    body: {
      id,
    },
    headers: {
      Authorization: `Bearer ${token.value.signtkn}`,
    },
  });
  alert("Deleted!");
  edit_dialog.value = false;
  refresh();
};

const d_selected_items = ref([]);
const d_source = ref("");
const d_id = ref("");
const d_checkNSFW = ref(false);
const d_wh = ref("");
const d_fext = ref("");

const edititem = async (
  id,
  img,
  is_nsfw,
  source,
  tags,
  width,
  height,
  fileext
) => {
  let nsfwstrtobool = null;
  if (is_nsfw === "true") {
    nsfwstrtobool = true;
  } else if (is_nsfw === "false") {
    nsfwstrtobool = false;
  } else {
    nsfwstrtobool = null;
  }
  d_checkNSFW.value = nsfwstrtobool;
  d_selected_items.value = tags;
  d_source.value = source;
  d_wh.value = `${width}x${height}`;
  d_fext.value = fileext;
  d_id.value = id;
  img_src.value = img;
  edit_dialog.value = true;
};

const saveEdit = async () => {
  disableForm.value = true;
  await useFetch(`https://api.husbando.pics/api/v1/husbando/operation/update`, {
    method: "POST",
    body: {
      id: d_id.value,
      is_nsfw: d_checkNSFW.value || false,
      source: d_source.value,
      tags: d_selected_items.value,
    },
    headers: {
      Authorization: `Bearer ${token.value.signtkn}`,
    },
  });
  disableForm.value = false;
  edit_dialog.value = false;
  alert("Saved!");
  refresh();
};

const viewImage = (url, id) => {
  img_id.value = id;
  img_src.value = url;
  viewimg_dialog.value = true;
};

const cstm_dialog = ref(false);
const cstm_title = ref("");
const cstm_text = ref("");

const cstmDialog = (title, text) => {
  cstm_title.value = title;
  cstm_text.value = text;
  cstm_dialog.value = true;
};

const zheaders = [
  { text: "Image", value: "img" },
  { text: "FN/ID", value: "id" },
  { text: "isNSFW", value: "is_nsfw" },
  { text: "Image size", value: "wh" },
  { text: "Uploaded date", value: "uploaded_at", sortable: true },
  { text: "Uploader IP", value: "ip" },
  { text: "Tags", value: "tags" },
  { text: "View out", value: "viewout" },
  { text: "Actions", value: "actions" },
];
const searchdb = ref("");

const { data: submission_data } = await useLazyFetch("/api/loadsub");
</script>

<template>
  <v-dialog v-model="viewimg_dialog" max-width="800px" scrim="#202020">
    <v-card>
      <v-card-text>View images : {{ img_id }}</v-card-text>
      <v-img :src="img_src"></v-img>
      <v-card-actions>
        <v-btn color="primary" block @click="viewimg_dialog = false">
          Close
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <v-dialog v-model="cstm_dialog" max-width="800px" scrim="#202020">
    <v-card>
      <v-card-title>{{ cstm_title }}</v-card-title>
      <v-card-text>{{ cstm_text }}</v-card-text>
      <v-card-actions>
        <v-btn color="primary" block @click="cstm_dialog = false">
          Close
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <v-dialog v-model="edit_dialog" max-width="800px" scrim="#202020">
    <v-card class="pa-5">
      <v-form
        :disabled="disableForm"
        ref="form"
        lazy-validation
        @submit.prevent="saveEdit"
        class="mt-7"
      >
        <div>
          <v-img :src="img_src" />
        </div>
        <div class="mt-1">
          <v-list>
            <v-list-item title="Image Dimension" :subtitle="d_wh"></v-list-item>
            <v-list-item
              title="File extension"
              :subtitle="d_fext"
            ></v-list-item>
            <v-list-item class="mt-1">
              <ClientOnly>
                <v-combobox                 
                  v-model="d_selected_items"
                  :items="items"
                  chips
                  required
                  clearable
                  label="Add tags"
                  multiple
                  prepend-icon="mdi-filter-variant"
                  variant="solo"
                >
                </v-combobox>
              </ClientOnly>
            </v-list-item>
            <v-list-item class="mt-1">
              <v-text-field
               
                v-model="d_source"
                label="Source (optional)"
                name="source"
                prepend-icon="mdi-web"
                variant="solo"
              ></v-text-field>
            </v-list-item>
            <v-list-item>
              <v-checkbox
                v-model="d_checkNSFW"
                prepend-icon="mdi-alert-circle-outline"
                name="tags"
                label="Is NSFW?"
              ></v-checkbox>
            </v-list-item>
          </v-list>
        </div>
        <div class="mt-5">
          <VBtn
            type="submit"
            block
            min-height="45"
            prepend-icon="mdi-floppy"
            class="gradient primary"
          >
            Save
          </VBtn>
          <v-btn
            class="mt-1"
            color="red"
            block
            prepend-icon="mdi-trash-can-outline"
            @click="deleteitem(d_id.split('.')[0])"
          >
            Delete
          </v-btn>
        </div>
      </v-form>
      <v-card-actions>
        <v-btn color="primary" block @click="edit_dialog = false">
          Close
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <VContainer fluid class="">
    <VRow align="center" justify="center" class="mx-5">
      <v-card>
        <v-tabs v-model="tab" bg-color="primary">
          <v-tab value="one">Image DB</v-tab>
          <v-tab value="two">Reported Inbox</v-tab>
          <v-tab value="three">Account</v-tab>
        </v-tabs>
        <v-card-text>
          <v-window v-model="tab">
            <v-window-item value="one">
              <div
                v-if="showLoading"
                style="
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  height: 100%;
                "
                class="m-5 fill-height fill-width"
              >
                <v-progress-circular
                  size="50"
                  indeterminate
                  color="primary"
                ></v-progress-circular>
              </div>
              <div v-if="dbtable">
                <v-list>
                  <v-list-item
                    title="Image stored"
                    :subtitle="i_dbdata.length === 0 ? 0 : i_dbdata.length + 1"
                  ></v-list-item>
                  <!-- search box -->
                </v-list>
                <v-list>
                  <v-list-item title="Refresh DB">
                    <v-btn icon="mdi-reload" @click="refresh()" />
                  </v-list-item>
                </v-list>
                <v-list>
                  <v-list-item title="Search">
                    <v-text-field
                      class="my-5"
                      v-model="searchdb"
                      append-icon="mdi-magnify"
                      label="Search"
                      single-line
                      hide-details
                    ></v-text-field>
                  </v-list-item>
                </v-list>
                <EasyDataTable
                  :headers="zheaders"
                  :items="i_dbdata"
                  border-cell
                  :search-value="searchdb"
                  table-class-name="v-table-theme"
                >
                  <template #item-img="{ url, id }">
                    <v-btn
                      icon="mdi-microsoft-xbox-controller-view"
                      ariant="tonal"
                      @click="viewImage(url, id)"
                    ></v-btn>
                  </template>
                  <template #item-wh="{ width, height }">
                    {{ width + "x" + height }}
                  </template>
                  <template #item-viewout="{ id }">
                    <v-btn
                      icon="mdi-web"
                      ariant="tonal"
                      :href="'/view/' + id.split('.')[0]"
                    ></v-btn>
                  </template>
                  <template
                    #item-actions="{
                      id,
                      url,
                      is_nsfw,
                      source,
                      tags,
                      width,
                      height,
                      file_extension,
                    }"
                  >
                    <v-btn
                      icon="mdi-pencil"
                      ariant="tonal"
                      @click="
                        edititem(
                          id,
                          url,
                          is_nsfw,
                          source,
                          tags,
                          width,
                          height,
                          file_extension
                        )
                      "
                    ></v-btn>
                  </template>
                </EasyDataTable>
              </div>
            </v-window-item>

            <v-window-item value="two">
              <v-table>
                <thead>
                  <tr>
                    <th class="text-left">Key</th>
                    <th class="text-left">Type</th>
                    <th class="text-left">File ID(s)</th>
                    <th class="text-left">Reason</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(d, i) in submission_data.data" :key="i">
                    <td>{{ d.key }}</td>
                    <td>{{ d.husbando_type_submsn }}</td>
                    <td>{{ d.husbando_form_file_id }}</td>
                    <td>
                      <v-btn
                        icon="mdi-arrow-expand"
                        @click="cstmDialog('Reason :', d.husbando_form_reason)"
                      ></v-btn>
                    </td>
                  </tr>
                </tbody>
              </v-table>
            </v-window-item>

            <v-window-item value="three">
              <v-row no-gutters align="start" justify="start">
                <v-col>
                  <h1 class="mb-2">Account :</h1>
                  <v-list>
                    <v-list-item
                      title="Username"
                      :subtitle="userData.user.name"
                    />
                  </v-list>
                  <v-list>
                    <v-list-item title="Account status" :subtitle="status" />
                  </v-list>
                  <v-list>
                    <v-list-item
                      title="Session date expire"
                      :subtitle="userData.expires"
                    />
                  </v-list>
                  <VBtn
                    type="submit"
                    block
                    min-height="44"
                    class="gradient primary mt-4"
                    @click="signOut()"
                    >Logout
                  </VBtn>
                </v-col>
              </v-row>
            </v-window-item>
          </v-window>
        </v-card-text>
      </v-card>
    </VRow>
  </VContainer>
</template>
<style>
.v-table-theme {
  --easy-table-header-height : 60px;
  --easy-table-body-row-height : 50px;
  --easy-table-header-font-size: 16px;
  --easy-table-header-background-color: #1f2937;
  --easy-table-header-font-color: #ffffff;
  --easy-table-body-row-background-color: #ffffff;
  --easy-table-body-row-font-size: 14px;
  --easy-table-body-row-font-color: #ffffff;
  --easy-table-body-row-background-color: #1f2937;
  --easy-table-body-row-hover-font-color: #ffffff;
  --easy-table-body-row-hover-background-color: #1f2937;
  --easy-table-body-even-row-font-color: #ffffff;
  --easy-table-body-even-row-background-color: #fafafa;
}
</style>