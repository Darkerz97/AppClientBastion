<script setup>
defineProps({
  title: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
})
</script>

<template>
  <section class="state-card">
    <div class="loader" />
    <h3>{{ title }}</h3>
    <p>{{ message }}</p>
  </section>
</template>
