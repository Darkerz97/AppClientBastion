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
  <section class="state-card state-card--empty">
    <div class="state-card__icon">○</div>
    <h3>{{ title }}</h3>
    <p>{{ message }}</p>
    <slot />
  </section>
</template>
