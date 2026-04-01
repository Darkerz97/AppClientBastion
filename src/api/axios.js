import axios from 'axios'

export const AUTH_TOKEN_KEY = 'cardbastion.customer.token'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 15000,
  headers: {
    Accept: 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(AUTH_TOKEN_KEY)

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

export function getApiErrorMessage(error, fallback = 'Ocurrio un error inesperado.') {
  if (error?.response?.status === 403) {
    return 'Tu cuenta no tiene permiso para usar esta API.'
  }

  if (error?.response?.status === 404) {
    return 'La ruta API no existe en el servidor configurado.'
  }

  return (
    error?.response?.data?.message ||
    error?.response?.data?.errors?.email?.[0] ||
    error?.response?.data?.error ||
    error?.message ||
    fallback
  )
}

export default api
