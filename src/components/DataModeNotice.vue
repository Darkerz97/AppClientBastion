<script setup>
defineProps({
  mode: {
    type: String,
    default: 'mock',
  },
})
</script>

<template>
  <section v-if="mode === 'mock'" class="surface-card mode-notice">
    <strong>Modo adaptador local</strong>
    <p>
      Esta app ya quedo preparada para jugador, pero mientras no existan endpoints publicos mobile se
      muestran datos desacoplados de prueba.
    </p>
  </section>
</template>
