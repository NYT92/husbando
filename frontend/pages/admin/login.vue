<template>
  <VContainer fluid class="fill-height">
    <VRow no-gutters align="center" justify="center" class="fill-height">
      <VCol cols="12" md="6" lg="5" sm="6">
        <VRow no-gutters align="center" justify="center">
          <VCol cols="12" md="6">
            <v-alert v-if="iserr" class="mb-2" closable :text="errtxt" type="error"></v-alert>
            <h1>Log in</h1>
            <p class="text-medium-emphasis">Admin dashboard</p>
            <VForm @submit.prevent="SignInHandler({username, password})" class="mt-7">
              <div class="mt-1">
                <label class="label text-grey-darken-2" for="username"
                  >Username</label
                >
                <VTextField
                  v-model="username"
                  prepend-inner-icon="fluent:person-accounts-20-filled"
                  id="username"
                  name="username"
                  type="text"
                />
              </div>
              <div class="mt-1">
                <label class="label text-grey-darken-2" for="password"
                  >Password</label
                >
                <VTextField
                  v-model="password"
                  prepend-inner-icon="fluent:password-20-regular"
                  id="password"
                  name="password"
                  type="password"
                />
              </div>
              <!-- <Turnstile /> -->
              <div class="mt-5">
                <VBtn
                  type="submit"
                  block
                  min-height="44"
                  class="gradient primary"
                  >Login
                </VBtn>
              </div>
            </VForm>
          </VCol>
        </VRow>
      </VCol>
    </VRow>
  </VContainer>
</template>
<script setup lang="ts">
definePageMeta({ auth: false });
useHead({
  title: "Login",
});
const username = ref("");
const password = ref("");
const iserr = ref(false);
const errtxt = ref("");
const { signIn } = useSession();
const SignInHandler = async ({
  username,
  password,
}: {
  username: string;
  password: string;
}) => {
  const { error, url } = await signIn("credentials", {
    username,
    password,
    redirect: false,
  });
  if (error) {
    iserr.value = true;
    errtxt.value = error;
  } else {
    {
      return navigateTo('/admin', { external: true });
    }
  }
};
</script>
