<script setup>
import BottomNav from '../components/BottomNav.vue'
</script>

<template>
  <div class="app-shell">
    <main class="app-content">
      <slot />
    </main>

    <BottomNav />
  </div>
</template>
