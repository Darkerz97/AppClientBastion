<script setup>
import { computed } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import AppLayout from './layouts/AppLayout.vue'

const route = useRoute()
const currentLayout = computed(() => (route.meta.layout === 'app' ? AppLayout : 'div'))
</script>

<template>
  <component :is="currentLayout">
    <RouterView />
  </component>
</template>
