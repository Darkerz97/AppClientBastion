<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import AppHeader from '../components/AppHeader.vue'
import Avatar from '../components/Avatar.vue'
import LoadingState from '../components/LoadingState.vue'
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()
const router = useRouter()

const profileRows = computed(() => [
  { label: 'Nombre', value: authStore.user?.name || 'Sin dato' },
  { label: 'Email', value: authStore.user?.email || 'Sin dato' },
  { label: 'Telefono', value: authStore.user?.phone || authStore.user?.telefono || 'Sin dato' },
  {
    label: 'Codigo de cliente',
    value: authStore.user?.customer_code || authStore.user?.code || authStore.user?.id || authStore.user?.customer_id || 'Sin dato',
  },
])

function handleLogout() {
  authStore.logout()
  router.replace('/login')
}
</script>

<template>
  <section class="page-section">
    <AppHeader
      title="Tu perfil"
      subtitle="Informacion personal y datos de tu cuenta."
      :avatar-name="authStore.customerName"
      :avatar-src="authStore.profilePhotoUrl"
    />

    <LoadingState
      v-if="authStore.bootstrapLoading"
      title="Cargando perfil"
      message="Estamos preparando tu informacion."
    />

    <section v-else class="premium-card profile-card">
      <div class="profile-card__hero">
        <Avatar :name="authStore.customerName" :src="authStore.profilePhotoUrl" size="xl" />
        <div class="profile-card__identity">
          <h2>{{ authStore.customerName }}</h2>
          <p>{{ authStore.user?.email || 'Sin correo disponible' }}</p>
        </div>
      </div>

      <div class="profile-grid">
        <div v-for="row in profileRows" :key="row.label" class="profile-row">
          <span>{{ row.label }}</span>
          <strong>{{ row.value }}</strong>
        </div>
      </div>

      <button class="ghost-button profile-card__logout" type="button" @click="handleLogout">
        Cerrar sesion
      </button>
    </section>
  </section>
</template>
