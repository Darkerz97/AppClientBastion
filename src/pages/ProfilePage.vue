<script setup>
import { computed, onBeforeUnmount, reactive, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import AppHeader from '../components/AppHeader.vue'
import Avatar from '../components/Avatar.vue'
import DataModeNotice from '../components/DataModeNotice.vue'
import LoadingState from '../components/LoadingState.vue'
import TierProgressCard from '../components/TierProgressCard.vue'
import { getTierProgress } from '../services/tiersService'
import { useAuthStore } from '../stores/auth'
import { formatCurrency } from '../utils/formatters'

const authStore = useAuthStore()
const router = useRouter()
const localError = ref('')
const localSuccess = ref('')
const fileInput = ref(null)
const previewUrl = ref('')
const tierProgress = ref({})

const form = reactive({
  name: '',
  phone: '',
  profilePhotoFile: null,
  removeProfilePhoto: false,
})

watch(
  () => authStore.user,
  (user) => {
    form.name = user?.name || ''
    form.phone = user?.phone || ''
    form.profilePhotoFile = null
    form.removeProfilePhoto = false
  },
  { immediate: true },
)

const email = computed(() => authStore.user?.email || 'Sin correo disponible')
const avatarPreview = computed(() => (form.removeProfilePhoto ? '' : previewUrl.value || authStore.profilePhotoUrl))
const accountRows = computed(() => [
  { label: 'Email', value: email.value },
  { label: 'Telefono', value: authStore.user?.phone || 'Sin telefono' },
  { label: 'Estado de cuenta', value: authStore.user?.accountStatus || 'Sin datos' },
  { label: 'Tier actual', value: authStore.user?.tierName || tierProgress.value.currentTier?.name || 'Bronce' },
  { label: 'Puntos actuales', value: `${authStore.user?.rewardPoints || 0}` },
  { label: 'Credito disponible', value: formatCurrency(authStore.user?.availableCredit) },
  { label: 'Compras registradas', value: `${authStore.user?.salesCount || 0}` },
])

function onFileChange(event) {
  const [file] = event.target.files || []
  form.profilePhotoFile = file || null
  form.removeProfilePhoto = false
}

watch(
  () => form.profilePhotoFile,
  (file) => {
    if (previewUrl.value) {
      URL.revokeObjectURL(previewUrl.value)
      previewUrl.value = ''
    }

    if (file) {
      previewUrl.value = URL.createObjectURL(file)
    }
  },
)

async function submitProfile() {
  localError.value = ''
  localSuccess.value = ''

  if (!form.name.trim()) {
    localError.value = 'Tu nombre es obligatorio.'
    return
  }

  try {
    await authStore.saveProfile(form)
    await authStore.refreshProfile()
    localSuccess.value = 'Perfil actualizado correctamente.'
    form.profilePhotoFile = null
    form.removeProfilePhoto = false

    if (fileInput.value) {
      fileInput.value.value = ''
    }
  } catch (error) {
    localError.value = authStore.error || error?.message || 'No fue posible actualizar el perfil.'
  }
}

async function handleLogout() {
  await authStore.logout()
  router.replace('/login')
}

getTierProgress().then((data) => {
  tierProgress.value = data
}).catch(() => {})

onBeforeUnmount(() => {
  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value)
  }
})
</script>

<template>
  <section class="page-section">
    <AppHeader
      title="Tu perfil"
      subtitle="Informacion personal, estado de cuenta y beneficios."
      :avatar-name="authStore.customerName"
      :avatar-src="authStore.profilePhotoUrl"
    />

    <DataModeNotice :mode="authStore.authMode" />

    <LoadingState v-if="authStore.bootstrapLoading" title="Cargando perfil" message="Estamos preparando tu informacion." />

    <template v-else>
      <section class="premium-card profile-card">
        <div class="profile-card__hero">
          <Avatar :name="authStore.customerName" :src="avatarPreview" size="xl" />
          <div class="profile-card__identity">
            <h2>{{ authStore.customerName }}</h2>
            <p>{{ email }}</p>
          </div>
        </div>

        <form class="stack" @submit.prevent="submitProfile">
          <div class="field">
            <label for="profile-name">Nombre</label>
            <input id="profile-name" v-model.trim="form.name" type="text" required />
          </div>

          <div class="field">
            <label for="profile-phone">Telefono</label>
            <input id="profile-phone" v-model.trim="form.phone" type="tel" placeholder="555-010-2026" />
          </div>

          <div class="field">
            <label for="profile-photo">Foto de perfil</label>
            <input id="profile-photo" ref="fileInput" accept="image/*" type="file" @change="onFileChange" />
          </div>

          <label class="checkbox-row">
            <input v-model="form.removeProfilePhoto" type="checkbox" />
            <span>Quitar foto actual</span>
          </label>

          <div v-if="localError || authStore.error" class="error-banner">
            {{ localError || authStore.error }}
          </div>

          <div v-if="localSuccess" class="success-banner">
            {{ localSuccess }}
          </div>

          <button class="button" type="submit" :disabled="authStore.savingProfile">
            {{ authStore.savingProfile ? 'Guardando...' : 'Guardar cambios' }}
          </button>
        </form>
      </section>

      <TierProgressCard :progress="tierProgress" />

      <section class="surface-card section-card">
        <div class="section-card__header">
          <div>
            <h2 class="section-card__title">Estado de tu cuenta</h2>
            <p class="section-card__text">Resumen corto pero util para soporte y seguimiento del cliente.</p>
          </div>
        </div>
        <div class="profile-grid">
          <div v-for="row in accountRows" :key="row.label" class="profile-row">
            <span>{{ row.label }}</span>
            <strong>{{ row.value }}</strong>
          </div>
        </div>
      </section>

      <button class="ghost-button profile-card__logout" type="button" @click="handleLogout">
        Cerrar sesion
      </button>
    </template>
  </section>
</template>
