<script setup>
const error = ref("Error");

onErrorCaptured((err) => {
  error.value = err.message;
  return false;
});
</script>

<template>
  <div>
    <NuxtLayout>
      <NuxtLoadingIndicator />
      <VContainer fluid class="fill-height">
        <VRow no-gutters align="center" justify="center" class="fill-height">
          <VCol cols="12" md="6" lg="6" sm="6">
            <VRow no-gutters align="center" justify="center">
              <VCol cols="12" lg="6" md="10">
                <v-card>
                  <v-card-title class="text-center">
                    <h1 class="text-h4">Error</h1>
                  </v-card-title>
                  <v-card-text>
                    <v-alert
                      type="error"
                      dense
                      :dismissible="false"
                      transition="scale-transition"
                    >
                      {{ error }}
                    </v-alert>
                  </v-card-text>
                  <v-card-actions>
                    <v-btn
                      to="/"
                      block
                      min-height="45"
                      class="gradient primary"
                    >
                      Back to home
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </VCol>
            </VRow>
          </VCol>
        </VRow>
      </VContainer>
    </NuxtLayout>
  </div>
</template>
