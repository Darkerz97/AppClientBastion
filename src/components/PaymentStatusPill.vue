<script setup>
import { computed } from 'vue'

const props = defineProps({
  status: {
    type: String,
    default: '',
  },
  pendingAmount: {
    type: Number,
    default: 0,
  },
})

const label = computed(() => {
  const source = `${props.status || ''}`.trim().toLowerCase()

  if (['paid', 'pagado', 'confirmed', 'confirmado', 'check-in', 'check_in'].includes(source)) {
    return 'Pagado'
  }

  if (['partial', 'abonada', 'parcial'].includes(source)) {
    return 'Abonado'
  }

  if (['cancelled', 'cancelado'].includes(source)) {
    return 'Cancelado'
  }

  if (props.pendingAmount > 0 || ['pending', 'pendiente', 'registered', 'registrado'].includes(source)) {
    return 'Pendiente'
  }

  return props.status || 'Sin estado'
})

const toneClass = computed(() => {
  const source = label.value.toLowerCase()

  if (source === 'pagado') {
    return 'is-settled'
  }

  if (source === 'abonado') {
    return 'is-partial'
  }

  if (source === 'cancelado') {
    return 'is-cancelled'
  }

  return 'is-pending'
})
</script>

<template>
  <span class="status-pill" :class="toneClass">{{ label }}</span>
</template>
