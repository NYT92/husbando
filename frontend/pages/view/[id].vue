<script setup>
const route = useRoute();
const { data, error } = await useFetch(
  `${useRuntimeConfig().public.Api_url}/api/v1/husbando/img/${route.params.id}`
);

const submitreportdia = ref(false);

const title = `${
  !data.value ? "Error" : data.value.id || "Error"
} | Husbando.pics`;
const description = `Husbando.pics is the place where you post your favorites male characters...`;
const image = `${
  data.value.is_nsfw === true || data.value.is_nsfw === "true" || !data.value
    ? ""
    : data.value.url
}`;
const url = "";

if (data !== null) {
  useHead({
    title: !data.value ? "Error" : data.value.id,
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
  });
} else {
  useHead({
    title: "404",
  });
}
</script>

<template>
  <v-layout row justify-center>
    <v-dialog v-model="submitreportdia" persistent max-width="500px">
      <v-card height="100vh">
        <iframe class="ifr_frm_embd" :src="useRuntimeConfig().public.FORMATE_URL+'f/husbandosub'" frameborder="0"></iframe>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="blue darken-1"
            flat
            @click.native="submitreportdia = false"
            >Close</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
  <VContainer fluid class="fill-height">
    <VRow no-gutters align="center" justify="center" class="fill-height">
      <v-col cols="10" xl="3" lg="4" md="5" sm="10">
        <v-img class="mx-auto" :src="data.url"></v-img>
        <v-table>
          <thead>
            <tr>
              <th class="text-left">Info</th>
              <th class="text-left"></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>File name</td>
              <td>{{ data.id }}</td>
            </tr>
            <tr>
              <td>Date Uploaded</td>
              <td>{{ new Date(data.uploaded_at) }}</td>
            </tr>
            <tr>
              <td>Is NSFW</td>
              <td>
                {{
                  data.is_nsfw === false || data.is_nsfw === "false"
                    ? "No"
                    : "Yes"
                }}
              </td>
            </tr>
            <tr>
              <td>Image size</td>
              <td>
                {{
                  data.width === undefined && data.height === undefined
                    ? "No data"
                    : data.width + "x" + data.height
                }}
              </td>
            </tr>
            <tr>
              <td>File extension</td>
              <td>{{ data.file_extension }}</td>
            </tr>
            <tr>
              <td>Tags</td>
              <td>
                <v-chip-group
                  style="display: grid; grid-auto-columns: min-content"
                >
                  <v-chip v-for="(d, i) in data.tags" :key="i">
                    {{ d }}
                  </v-chip>
                </v-chip-group>
              </td>
            </tr>
            <tr>
              <td>Sources</td>
              <td>
                <v-btn
                  prepend-icon="mdi-web"
                  color="black"
                  :href="'https://saucenao.com/search.php?url=' + data.url"
                >
                  Saucenao
                </v-btn>
              </td>
            </tr>
            <tr>
              <td>Download</td>
              <td>
                <v-btn
                  prepend-icon="mdi-download"
                  color="blue"
                  :href="data.url"
                  target="_blank"
                >
                  Download
                </v-btn>
              </td>
            </tr>
            <tr>
              <td>Report</td>
              <td>
                <v-btn
                  prepend-icon="fluent:warning-12-regular"
                  color="yellow"
                  @click="submitreportdia = true"
                >
                  Report
                </v-btn>
              </td>
            </tr>
          </tbody>
        </v-table>
      </v-col>
      <v-col v-if="data === null" cols="12" lg="6" md="10">
        <h1>Your husbando is not found...</h1>
      </v-col>
    </VRow>
  </VContainer>
</template>
<style>
.ifr_frm_embd {
  height: 100vh;
  width: 100%;
}
</style>