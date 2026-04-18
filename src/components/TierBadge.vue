<script setup>
defineProps({
  tier: {
    type: Object,
    default: () => ({}),
  },
})
</script>

<template>
  <div class="tier-badge" :style="{ '--tier-accent': tier.accentColor || '#f2b138' }">
    <span class="tier-badge__eyebrow">Tier actual</span>
    <strong class="tier-badge__name">{{ tier.name || 'Bronce' }}</strong>
  </div>
</template>
