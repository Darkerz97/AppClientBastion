import axios from 'axios'
import { Capacitor } from '@capacitor/core'

export const AUTH_TOKEN_KEY = 'cardbastion.customer.token'

const configuredApiBaseUrl = import.meta.env.VITE_API_BASE_URL || '/api'
const configuredProxyTarget = import.meta.env.VITE_API_PROXY_TARGET || ''
const nativeApiBaseUrl = import.meta.env.VITE_API_NATIVE_BASE_URL || 'https://www.cardbastion.com/api'
const configuredSiteBaseUrl = import.meta.env.VITE_PUBLIC_SITE_URL || '/'

function isLocalWebHost() {
  if (typeof window === 'undefined') {
    return false
  }

  const hostname = window.location.hostname

  return (
    hostname === 'localhost' ||
    hostname === '127.0.0.1' ||
    hostname === '0.0.0.0' ||
    hostname.endsWith('.local')
  )
}

function resolveWebApiBaseUrl() {
  if (/^https?:\/\//i.test(configuredApiBaseUrl)) {
    return configuredApiBaseUrl
  }

  if (configuredProxyTarget && isLocalWebHost()) {
    return buildAbsoluteUrl(configuredProxyTarget, configuredApiBaseUrl)
  }

  return configuredApiBaseUrl
}

export const RESOLVED_API_BASE_URL =
  Capacitor.isNativePlatform() && !/^https?:\/\//i.test(configuredApiBaseUrl)
    ? nativeApiBaseUrl
    : resolveWebApiBaseUrl()

export const RESOLVED_SITE_BASE_URL =
  Capacitor.isNativePlatform() && !/^https?:\/\//i.test(configuredSiteBaseUrl)
    ? 'https://www.cardbastion.com'
    : configuredSiteBaseUrl === '/'
      ? ''
      : configuredSiteBaseUrl

function ensureTrailingSlash(value) {
  return value.endsWith('/') ? value : `${value}/`
}

export function buildAbsoluteUrl(baseUrl, path) {
  if (!baseUrl || /^https?:\/\//i.test(path)) {
    return path
  }

  if (/^https?:\/\//i.test(baseUrl)) {
    return new URL(path.replace(/^\/+/, ''), ensureTrailingSlash(baseUrl)).toString()
  }

  const normalizedBase = baseUrl.startsWith('/') ? baseUrl : `/${baseUrl}`
  const normalizedPath = path.replace(/^\/+/, '')

  return `${ensureTrailingSlash(normalizedBase)}${normalizedPath}`
}

const api = axios.create({
  baseURL: RESOLVED_API_BASE_URL,
  timeout: 15000,
  headers: {
    Accept: 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
})

export const siteApi = axios.create({
  baseURL: RESOLVED_SITE_BASE_URL,
  timeout: 15000,
  headers: {
    Accept: 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
})

function attachAuthHeader(config) {
  const token = localStorage.getItem(AUTH_TOKEN_KEY)

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
}

api.interceptors.request.use(attachAuthHeader)
siteApi.interceptors.request.use(attachAuthHeader)

export function getApiErrorMessage(error, fallback = 'Ocurrio un error inesperado.') {
  if (error?.code === 'ERR_NETWORK') {
    return 'No se pudo conectar con Card Bastion. Revisa internet o la URL del API configurada.'
  }

  if (error?.response?.status === 403) {
    return 'Tu cuenta no tiene permiso para usar esta API.'
  }

  if (error?.response?.status === 404) {
    const route =
      error?.config?.url ||
      error?.response?.config?.url ||
      error?.request?.responseURL ||
      ''

    return route
      ? `La ruta API no existe en el servidor configurado: ${route}`
      : 'La ruta API no existe en el servidor configurado.'
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
