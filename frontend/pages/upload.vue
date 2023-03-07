<script setup>
import axios from "axios";

useHead({
  title: "Upload your image",
  meta: [{ name: "description", content: "Upload your husbando image...." }],
});
const image = ref([]);
const url = ref("");
const tags = ref([]);
const source = ref("");
const checkNSFW = ref(false);
const hidewhenupload = ref(true);
const successfulupload = ref(false);
const disableForm = ref(false);
const imgid = ref("");
const iserr = ref(false);
const errtext = ref("");
const showRuleDialog = ref(true);
const turnstile_token = ref("");

const turnstile = ref();
turnstile.value?.reset();

const items = [
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
];

const submit = async () => {
  disableForm.value = true;
  const form = new FormData();
  form.append("image", image.value[0]);
  form.append("tags", JSON.stringify(tags.value));
  form.append("is_nsfw", JSON.stringify(checkNSFW.value));
  form.append("source", JSON.stringify(source.value));
  const data = {
    method: "POST",
    url: `${useRuntimeConfig().public.Api_url}/api/file/hdoupload`,
    data: form,
  };

  const { data: validateTS } = await useFetch("/api/turnstile", {
    method: "POST",
    body: {
      token: turnstile_token.value,
    },
  });

  if (!validateTS.value.success) {
    disableForm.value = false;
    iserr.value = true;
    errtext.value = "Turnstile is not ready!";
  } else {
    await axios(data)
      .then((res) => {
        url.value = res.data.data.url;
        imgid.value = res.data.data.id.split(".")[0];
        hidewhenupload.value = false;
        successfulupload.value = true;
        disableForm.value = true;
      })
      .catch((err) => {
        disableForm.value = false;
        iserr.value = true;
        errtext.value = err.message;
        turnstile.value?.reset();
      });
  }
};

const copyToClipboard = (url) => {
  navigator.clipboard.writeText(url);
  alert("Copied to clipboard!");
};
</script>
<script>
export default {
  data() {
    return {
      previewImage: null,
    };
  },
  methods: {
    selectImage() {
      this.$refs.fileInput.click();
    },
    pickFile() {
      let input = this.$refs.fileInput;
      let file = input.files;
      if (file && file[0]) {
        let reader = new FileReader();
        reader.onload = (e) => {
          this.previewImage = e.target.result;
        };
        reader.readAsDataURL(file[0]);
        this.$emit("input", file[0]);
      }
    },
  },
};
</script>
<template>
  <v-dialog v-model="showRuleDialog" persistent max-width="600" scrim="#202020">
    <v-card>
      <v-card-title>Before uploading</v-card-title>
      <v-card-text>
        <div style="text-align: start; font-size: large">
          <p class="mb-2">
            When uploading an image, be sure to read our rules before uploading
            it.
          </p>
          <ul class="ml-8">
            <li>
              OBVIOUSLY DO NOT UPLOAD WAIFU IMAGE. (USE
              <a href="https://waifu.pics" target="_blank">waifu.pics</a>)
            </li>
            <li>Do not upload R-18 shota, illegal media, and R-18G (GORE)</li>
            <li>
              All images must be marked as NSFW if they contain as follows:
              <ul class="ml-5">
                <li>Naked body</li>
                <li>Sex-related</li>
                <li>Showing penis/asshole</li>
                <li>Lightsaber censor</li>
              </ul>
            </li>
            <li>You can only upload 12MB of images or gifs.</li>
            <li>
              You must include at least one tag when uploading. (If there is no
              tag that fit the image or gif, find an alternative or wait for us
              to include more tag)
            </li>
            <li>
              Report us any issue related to the website or the image that
              violated our rules.
            </li>
          </ul>
        </div>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" flat href="https://fbi.gov">Disagree</v-btn>
        <v-btn color="primary" flat @click.native="showRuleDialog = false"
          >Agree</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
  <VContainer fluid class="fill-height">
    <VRow no-gutters align="center" justify="center" class="fill-height">
      <VCol cols="12" md="6" lg="6" sm="6">
        <VRow no-gutters align="center" justify="center">
          <VCol v-if="hidewhenupload" cols="12" lg="6" md="10">
            <v-alert
              v-if="iserr"
              :text="errtext"
              type="error"
            ></v-alert>
            <h1>Upload picture...</h1>
            <p class="text-medium-emphasis">
              Before uploading an image or a gif, please read our
              <NuxtLink to="/docs/tos">guidelines</NuxtLink> for it.
            </p>
            <v-form
              :disabled="disableForm"
              ref="form"
              lazy-validation
              @submit.prevent="submit"
              class="mt-7"
            >
              <div>
                <label class="label text-grey-darken-2" for="image">
                  Upload image
                </label>
                <v-file-input
                  v-model="image"
                  required
                  label="Image input"
                  variant="solo"
                  name="image"
                  accept="image/png, image/jpeg, image/jpg, image/gif"
                  style="word-break: break-word"
                  ref="fileInput"
                  type="file"
                  @input="pickFile"
                ></v-file-input>
              </div>
              <div>
                <v-img :src="previewImage" />
              </div>
              <div class="mt-1">
                <label class="label text-grey-darken-2" for="tag"> Tags </label>
                <v-select
                  v-model="tags"
                  :items="items"
                  chips
                  required
                  clearable
                  label="Add tags"
                  multiple
                  prepend-icon="mdi-tag-outline"
                  variant="solo"
                />
              </div>
              <div class="mt-1">
                <label class="label text-grey-darken-2" for="checkNSFW">
                  Is the images safe?
                </label>
                <v-checkbox
                  v-model="checkNSFW"
                  name="checkNSFW"
                  label="Is NSFW?"
                ></v-checkbox>
              </div>
              <div class="mt-1">
                <label class="label text-grey-darken-2" for="source">
                  Source
                </label>
                <v-text-field
                  v-model="source"
                  label="Source (optional)"
                  name="source"
                  prepend-icon="mdi-web"
                  variant="solo"
                ></v-text-field>
              </div>
              <div class="mt-1">
                <label class="label text-grey-darken-2" for="source">
                  Turnstile
                </label>
                <Turnstile ref="turnstileref" v-model="turnstile_token" />
                <span class="text-grey-darken-2">
                  If the turnstile did not load, turn off ad blocker.
                </span>
              </div>
              <div class="mt-5">
                <VBtn
                  type="submit"
                  block
                  min-height="45"
                  class="gradient primary"
                >
                  Upload
                </VBtn>
              </div>
            </v-form>
          </VCol>
          <!-- <VCol v-if="hidewhenupload" cols="12" lg="6" md="10"> </VCol> -->
          <VCol v-if="successfulupload" cols="12" lg="6" md="10">
            <h1>Upload Successfully</h1>
            <p class="text-medium-emphasis mb-2">
              Your image has been uploaded successfully. You can share the image
              by clicking the button below.
            </p>
            <v-img :src="url"></v-img>
            <div class="mt-5">
              <VBtn
                @click="copyToClipboard(url)"
                block
                min-height="45"
                class="gradient secondary my-1"
                append-icon="mdi-content-copy"
              >
                Copy to clipboard
              </VBtn>
              <VBtn
                :to="'/view/' + imgid"
                block
                min-height="45"
                class="gradient secondary my-1"
                append-icon="mdi-open-in-new"
              >
                Go to the page
              </VBtn>
            </div>
            <div class="mt-5">
              <VBtn
                @click="
                  {
                    (successfulupload = false),
                      (hidewhenupload = true),
                      turnstile.reset(),
                      (previewImage = null);
                  }
                "
                block
                append-icon="mdi-upload"
                min-height="45"
                class="gradient primary"
              >
                Upload again ?
              </VBtn>
            </div>
          </VCol>
        </VRow>
      </VCol>
    </VRow>
  </VContainer>
</template>
