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
  loading: {
    type: Boolean,
    default: false,
  },
})
</script>

<template>
  <section class="surface-card state-card">
    <div v-if="loading" class="loader" />
    <h3>{{ title }}</h3>
    <p>{{ message }}</p>
    <slot />
  </section>
</template>
