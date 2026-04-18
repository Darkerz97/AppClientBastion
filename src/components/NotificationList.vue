<script setup>
import { formatShortDate } from '../utils/formatters'

defineProps({
  notifications: {
    type: Array,
    default: () => [],
  },
  busyId: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['mark-read'])
</script>

<template>
  <div class="list compact-list">
    <article
      v-for="notification in notifications"
      :key="notification.id"
      class="surface-subcard"
      :class="{ 'surface-subcard--unread': !notification.readAt }"
    >
      <div class="row-between">
        <div>
          <p class="preorder-label">{{ notification.type }}</p>
          <h3 class="preorder-name">{{ notification.title }}</h3>
        </div>
        <span class="status-pill" :class="notification.readAt ? 'is-default' : 'is-pending'">
          {{ notification.readAt ? 'Leida' : 'Nueva' }}
        </span>
      </div>

      <p class="muted">{{ notification.message }}</p>

      <div class="row-between">
        <span class="preorder-label">{{ formatShortDate(notification.createdAt) }}</span>
        <button
          v-if="!notification.readAt"
          class="header-link-button"
          type="button"
          :disabled="busyId === `${notification.id}`"
          @click="emit('mark-read', notification.id)"
        >
          {{ busyId === `${notification.id}` ? 'Guardando...' : 'Marcar leida' }}
        </button>
      </div>
    </article>
  </div>
</template>
