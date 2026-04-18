<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import AppHeader from '../components/AppHeader.vue'
import DataModeNotice from '../components/DataModeNotice.vue'
import EmptyState from '../components/EmptyState.vue'
import LoadingState from '../components/LoadingState.vue'
import NotificationList from '../components/NotificationList.vue'
import { getNotifications, markNotificationAsRead } from '../services/notificationsService'
import { useAuthStore } from '../stores/auth'
import { toServiceError } from '../utils/serviceError'

const router = useRouter()
const authStore = useAuthStore()
const loading = ref(true)
const savingId = ref('')
const error = ref('')
const notifications = ref([])
const unreadCount = computed(() => notifications.value.filter((item) => !item.readAt).length)

async function loadNotifications() {
  loading.value = true
  error.value = ''

  try {
    notifications.value = await getNotifications()
  } catch (requestError) {
    error.value = toServiceError(requestError, 'No fue posible cargar tus avisos.')
  } finally {
    loading.value = false
  }
}

async function handleMarkRead(notificationId) {
  savingId.value = `${notificationId}`

  try {
    const updated = await markNotificationAsRead(`${notificationId}`)
    notifications.value = notifications.value.map((notification) =>
      `${notification.id}` === `${notificationId}` ? updated : notification,
    )
  } catch (requestError) {
    error.value = toServiceError(requestError, 'No fue posible actualizar la notificacion.')
  } finally {
    savingId.value = ''
  }
}

function openNotification(notification) {
  if (notification.actionTo) {
    router.push(notification.actionTo)
  }
}

onMounted(loadNotifications)
</script>

<template>
  <section class="page-section">
    <AppHeader
      title="Notificaciones"
      :subtitle="`${unreadCount} avisos pendientes de revisar.`"
      :avatar-name="authStore.customerName"
      :avatar-src="authStore.profilePhotoUrl"
    />

    <DataModeNotice :mode="authStore.authMode" />

    <LoadingState v-if="loading" title="Cargando avisos" message="Estamos reuniendo tus recordatorios mas importantes." />

    <EmptyState v-else-if="error" title="No fue posible cargar notificaciones" :message="error" />

    <EmptyState v-else-if="!notifications.length" title="Sin notificaciones" message="Cuando haya avisos de torneos, preventas o recompensas los veras aqui." />

    <section v-else class="surface-card section-card">
      <div class="section-card__header">
        <div>
          <h2 class="section-card__title">Centro de avisos</h2>
          <p class="section-card__text">Puedes marcar como leido y navegar al modulo relacionado.</p>
        </div>
      </div>

      <NotificationList :notifications="notifications" :busy-id="savingId" @mark-read="handleMarkRead" />

      <div class="list compact-list">
        <button
          v-for="notification in notifications.filter((item) => item.actionTo)"
          :key="`cta-${notification.id}`"
          class="ghost-button"
          type="button"
          @click="openNotification(notification)"
        >
          {{ notification.actionLabel || 'Abrir aviso' }}
        </button>
      </div>
    </section>
  </section>
</template>
