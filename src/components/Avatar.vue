<script setup>
import { computed } from 'vue'

const props = defineProps({
  src: {
    type: String,
    default: '',
  },
  name: {
    type: String,
    default: 'Card Bastion',
  },
  size: {
    type: String,
    default: 'md',
  },
})

const initials = computed(
  () =>
    props.name
      .trim()
      .split(' ')
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join('') || 'CB',
)
</script>

<template>
  <div class="avatar" :class="`avatar--${size}`">
    <img v-if="src" :src="src" :alt="name" class="avatar__image" />
    <span v-else class="avatar__fallback">{{ initials }}</span>
  </div>
</template>
