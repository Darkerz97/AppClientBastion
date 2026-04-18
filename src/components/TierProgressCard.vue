<script setup>
import TierBadge from './TierBadge.vue'

defineProps({
  progress: {
    type: Object,
    default: () => ({}),
  },
})
</script>

<template>
  <article class="premium-card tier-progress-card">
    <div class="row-between">
      <div>
        <p class="preorder-label">Nivel del jugador</p>
        <h3 class="preorder-name">Tu progreso de fidelizacion</h3>
      </div>
      <TierBadge :tier="progress.currentTier" />
    </div>

    <div class="tier-progress-card__meter">
      <div class="tier-progress-card__fill" :style="{ width: `${progress.progressPercentage || 0}%` }" />
    </div>

    <div class="data-grid tier-progress-card__stats">
      <div class="data-point">
        <span>{{ progress.trackedMetricLabel || 'Puntos acumulados' }}</span>
        <strong>{{ progress.currentPoints || 0 }}</strong>
      </div>
      <div class="data-point">
        <span>Siguiente tier</span>
        <strong>{{ progress.nextTier?.name || 'Maximo alcanzado' }}</strong>
      </div>
      <div class="data-point">
        <span>Faltan</span>
        <strong>{{ progress.pointsToNextTier || 0 }}</strong>
      </div>
    </div>

    <div v-if="progress.currentTier?.benefits?.length" class="benefit-list">
      <span v-for="benefit in progress.currentTier.benefits" :key="benefit" class="benefit-chip">
        {{ benefit }}
      </span>
    </div>
  </article>
</template>
