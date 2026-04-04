import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { getApiErrorMessage, AUTH_TOKEN_KEY } from '../api/axios'
import {
  authClientMeta,
  getCurrentCustomer,
  loginCustomer,
  logoutCustomer,
  registerCustomer,
  updateCustomerProfile,
} from '../services/authClientService'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem(AUTH_TOKEN_KEY) || '')
  const user = ref(null)
  const loading = ref(false)
  const bootstrapLoading = ref(false)
  const bootstrapped = ref(false)
  const error = ref('')
  const savingProfile = ref(false)
  const authMode = ref(authClientMeta.mode)

  const isAuthenticated = computed(() => Boolean(token.value && user.value))
  const customerName = computed(() => user.value?.name || user.value?.first_name || 'Cliente')
  const customerFirstName = computed(() => customerName.value.trim().split(' ')[0] || 'Cliente')
  const isUsingMockBackend = computed(() => authMode.value === 'mock')
  const customerInitials = computed(() => {
    const source = customerName.value.trim()

    return source
      .split(' ')
      .slice(0, 2)
      .map((chunk) => chunk.charAt(0).toUpperCase())
      .join('') || 'CB'
  })
  // Expected backend photo fields, in priority order:
  // profile_photo_url, avatar_url, photo_url
  const profilePhotoUrl = computed(
    () =>
      user.value?.profilePhotoUrl ||
      user.value?.profile_photo_url ||
      user.value?.avatar_url ||
      user.value?.photo_url ||
      '',
  )

  function setToken(value) {
    token.value = value || ''

    if (token.value) {
      localStorage.setItem(AUTH_TOKEN_KEY, token.value)
    } else {
      localStorage.removeItem(AUTH_TOKEN_KEY)
    }
  }

  function setUser(value) {
    user.value = value || null
  }

  function clearSession() {
    setToken('')
    setUser(null)
    error.value = ''
  }

  async function bootstrap() {
    if (bootstrapped.value || bootstrapLoading.value) {
      return
    }

    if (!token.value) {
      bootstrapped.value = true
      return
    }

    bootstrapLoading.value = true
    error.value = ''

    try {
      const customer = await getCurrentCustomer()
      setUser(customer)
    } catch {
      clearSession()
    } finally {
      bootstrapLoading.value = false
      bootstrapped.value = true
    }
  }

  async function login(credentials) {
    loading.value = true
    error.value = ''

    try {
      const session = await loginCustomer(credentials)

      if (!session.token) {
        throw new Error('La API no devolvio un token valido.')
      }

      setToken(session.token)

      if (session.customer) {
        setUser(session.customer)
      } else {
        const customer = await getCurrentCustomer()
        setUser(customer)
      }

      bootstrapped.value = true
    } catch (requestError) {
      clearSession()
      error.value = getApiErrorMessage(requestError, 'No fue posible iniciar sesion.')
      throw requestError
    } finally {
      loading.value = false
    }
  }

  async function register(payload) {
    loading.value = true
    error.value = ''

    try {
      const session = await registerCustomer(payload)

      if (!session.token) {
        throw new Error('La respuesta de registro no devolvio una sesion valida.')
      }

      setToken(session.token)
      setUser(session.customer)
      bootstrapped.value = true
    } catch (requestError) {
      clearSession()
      error.value = getApiErrorMessage(requestError, 'No fue posible crear tu cuenta.')
      throw requestError
    } finally {
      loading.value = false
    }
  }

  async function hydrateSession(session) {
    error.value = ''

    if (!session?.token) {
      throw new Error('No recibimos un token valido desde el flujo externo.')
    }

    setToken(session.token)

    if (session.customer) {
      setUser(session.customer)
    } else {
      const customer = await getCurrentCustomer()
      setUser(customer)
    }

    bootstrapped.value = true
  }

  async function completeExternalAuth(session) {
    loading.value = true

    try {
      await hydrateSession(session)
    } catch (requestError) {
      clearSession()
      error.value = getApiErrorMessage(requestError, 'No fue posible completar el acceso.')
      throw requestError
    } finally {
      loading.value = false
    }
  }

  async function refreshProfile() {
    const customer = await getCurrentCustomer()
    setUser(customer)
    return customer
  }

  async function saveProfile(payload) {
    savingProfile.value = true
    error.value = ''

    try {
      const customer = await updateCustomerProfile(payload)
      setUser(customer)
      return customer
    } catch (requestError) {
      error.value = getApiErrorMessage(requestError, 'No fue posible actualizar tu perfil.')
      throw requestError
    } finally {
      savingProfile.value = false
    }
  }

  async function logout() {
    try {
      await logoutCustomer()
    } finally {
      clearSession()
      bootstrapped.value = true
    }
  }

  return {
    token,
    user,
    loading,
    bootstrapLoading,
    bootstrapped,
    error,
    savingProfile,
    authMode,
    isAuthenticated,
    isUsingMockBackend,
    customerName,
    customerFirstName,
    customerInitials,
    profilePhotoUrl,
    bootstrap,
    login,
    register,
    hydrateSession,
    completeExternalAuth,
    refreshProfile,
    saveProfile,
    logout,
  }
})
