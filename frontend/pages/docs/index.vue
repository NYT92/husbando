<script setup>
useHead({
  title: "Docs",
  meta: [{ name: "description", content: "Husbando.pics's official docs." }],
});
</script>
<template>
  <VContainer fluid class="fill-height">
    <VRow no-gutters align="center" justify="center" class="fill-height">
      <VCol cols="12" md="6" lg="6" sm="6">
        <h1>Welcome to husbando.pics</h1>
        <p>The place where you upload your favorite fictional man character.</p>
        <div class="mt-2">
          <NuxtLink to="/upload" block min-height="45" class="mt-1 text-primary">
            Upload
          </NuxtLink>
          /
          <NuxtLink to="/docs/tos" block min-height="45" class="mt-1 text-primary">
            Guidelines
          </NuxtLink>
          /
          <NuxtLink href="https://github.com/nyt92/husbando#api-docs" block min-height="45" class="mt-1 text-primary">
            API Documentation
          </NuxtLink>
        </div>
      </VCol>
    </VRow>
  </VContainer>
</template>
