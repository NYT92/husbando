<template>
  <div class="flex flex-col gap-2">
    <UButton
      @click="shareOnFacebook"
      color="blue"
      icon="i-tabler-brand-facebook"
      block
      >Share on Facebook</UButton
    >
    <UButton
      @click="shareOnTwitter"
      color="cyan"
      icon="i-tabler-brand-twitter"
      block
      >Share on Twitter</UButton
    >
    <UButton
      @click="copyLink"
      color="gray"
      icon="i-tabler-copy"
      block
      >Copy Link</UButton
    >
  </div>
</template>

<script setup>
const props = defineProps({
  url: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    default: "",
  },
});

const shareOnFacebook = () => {
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
    props.url
  )}`;
  window.open(facebookUrl, "_blank");
};

const shareOnTwitter = () => {
  const twitterUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(
    props.url
  )}&text=${encodeURIComponent(props.text)}`;
  window.open(twitterUrl, "_blank");
};

const shareOnLinkedIn = () => {
  const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
    props.url
  )}`;
  window.open(linkedInUrl, "_blank");
};

const copyLink = () => {
  navigator.clipboard.writeText(props.url).then(() => {
    alert("Link copied to clipboard!");
  });
};
</script>
