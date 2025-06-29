<script setup lang="ts">
import type { FormError, FormSubmitEvent, AlertColor } from "#ui/types";

useSeoMeta({
  title: 'Sign in',
  description: 'Restricted area for admin only...',
  ogTitle: 'Sign in - Husbando.pics',
  ogDescription: 'Restricted area for admin only...',
  ogImage: '',
  ogUrl: '',
  twitterTitle: 'Sign in - Husbando.pics',
  twitterDescription: 'Restricted area for admin only...',
  twitterImage: '',
  twitterCard: 'summary'
})

useHead({
  htmlAttrs: {
    lang: 'en'
  },
})

const { signIn } = useAuth();
const state = reactive({
  username: undefined,
  password: undefined,
  code: undefined,
});

const authAlert = ref({
  title: "",
  description: <any>"",
  color: <AlertColor>"",
  isTrue: false,
});

const validate = (state: any): FormError[] => {
  const errors = [];
  if (!state.username) errors.push({ path: "username", message: "Required!" });
  if (!state.password) errors.push({ path: "password", message: "Required!" });
  if (!state.code) errors.push({ path: "code", message: "Required!" });
  return errors;
};

async function onSubmit(event: FormSubmitEvent<any>) {
  console.log(event.data);
  try {
    const result = await signIn("credentials", {
      username: state.username,
      password: state.password,
      accesscode: state.code,
      redirect: false,
    });
    
    // Handle the new SignInResult return type from v1.0
    if (result.ok && result.error === null) {
      return navigateTo("/dashboard", { external: true });
    } else {
      // Handle authentication error
      authAlert.value = {
        title: "Authentication Failed",
        description: result.error || "Invalid credentials provided",
        color: "red",
        isTrue: true,
      };
    }
  } catch (e) {
    console.log(e);
    authAlert.value = {
      title: "Error",
      description: "An unexpected error occurred during sign in",
      color: "red",
      isTrue: true,
    };
  }
}
const query = useRoute().query;
onMounted(() => {
  if (query?.error == "undefined" || query?.error == "") {
    authAlert.value = {
      title: "Error",
      description: "Authentication required!",
      color: "red",
      isTrue: true,
    };
  }
});
</script>

<template>
  <UContainer class="flex flex-col gap-4 my-5 h-[calc(100vh-55px)]">
    <UAlert
      v-if="authAlert.isTrue"
      :title="authAlert.title"
      :description="authAlert.description"
      :color="authAlert.color"
    />
    <UCard>
      <h1 class="text-2xl font-bold pb-2">Sign in to Dashboard</h1>
      <UAlert
        class="my-2"
        title="Warning!"
        description="This is a private area accessible only to the admin."
        color="yellow"
      />
      <UForm
        :validate="validate"
        :state="state"
        class="space-y-4"
        @submit="onSubmit"
      >
        <UFormGroup label="Username" name="username">
          <UInput v-model="state.username" size="xl" />
        </UFormGroup>

        <UFormGroup label="Password" name="password">
          <UInput v-model="state.password" type="password" size="xl" />
        </UFormGroup>

        <UFormGroup label="Access Code" name="code">
          <UInput v-model="state.code" size="xl" />
        </UFormGroup>

        <UButton type="submit" size="xl"> Sign in </UButton>
      </UForm>
    </UCard>
  </UContainer>
</template>
