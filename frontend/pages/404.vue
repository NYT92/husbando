<script setup>
useHead({
  title: "404",
});
</script>
<template>
  <VContainer fluid class="fill-height">
    <VRow no-gutters align="center" justify="center" class="fill-height">
      <VCol cols="12" md="6" lg="6" sm="6">
        <VRow no-gutters align="center" justify="center">
          <VCol cols="12" lg="6" md="10">
            <h1>404</h1>
            <h1>Page not found</h1>
            <VBtn
              prepend-icon="mdi-arrow-left"
              color="black"
              to="/"
              class="mt-5"
            >
              Back to home
            </VBtn>
          </VCol>
        </VRow>
      </VCol>
    </VRow>
  </VContainer>
</template>
