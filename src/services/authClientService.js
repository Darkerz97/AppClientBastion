import { normalizeCustomerProfile } from '../types/customerProfile'
import { PLAYER_API_ENDPOINTS, PLAYER_API_MODE, hasPlayerEndpoint } from './playerClientConfig'
import {
  mockGetCurrentCustomer,
  mockLogin,
  mockLogout,
  mockRegister,
  mockUpdateProfile,
} from './playerMockBackend'
import { requestPlayerEndpoint } from './playerHttp'
import { createMissingEndpointError } from '../utils/serviceError'

function unwrap(payload) {
  return payload?.data ?? payload
}

function pickSession(payload) {
  const data = unwrap(payload)
  const token =
    data?.token || data?.access_token || data?.accessToken || data?.data?.token || null
  const customer = data?.customer || data?.user || data?.profile || data?.data || null

  return {
    token,
    customer: customer ? normalizeCustomerProfile(customer) : null,
  }
}

export const authClientMeta = {
  mode: PLAYER_API_MODE,
}

export async function loginCustomer(credentials) {
  if (PLAYER_API_MODE !== 'api') {
    return mockLogin(credentials)
  }

  if (!hasPlayerEndpoint('login')) {
    throw createMissingEndpointError('login de jugador')
  }

  const { data } = await requestPlayerEndpoint('post', PLAYER_API_ENDPOINTS.login, {
    data: {
      ...credentials,
      device_name: 'card-bastion-client-app',
    },
  })

  return pickSession(data)
}

export async function registerCustomer(payload) {
  if (PLAYER_API_MODE !== 'api') {
    return mockRegister(payload)
  }

  if (!hasPlayerEndpoint('register')) {
    throw createMissingEndpointError('registro de jugador')
  }

  const { data } = await requestPlayerEndpoint('post', PLAYER_API_ENDPOINTS.register, {
    data: payload,
  })

  return pickSession(data)
}

export async function getCurrentCustomer() {
  if (PLAYER_API_MODE !== 'api') {
    return normalizeCustomerProfile(await mockGetCurrentCustomer())
  }

  if (!hasPlayerEndpoint('currentProfile')) {
    throw createMissingEndpointError('perfil actual del jugador')
  }

  const { data } = await requestPlayerEndpoint('get', PLAYER_API_ENDPOINTS.currentProfile)
  return normalizeCustomerProfile(unwrap(data))
}

export async function updateCustomerProfile(payload) {
  if (PLAYER_API_MODE !== 'api') {
    return normalizeCustomerProfile(await mockUpdateProfile(payload))
  }

  if (!hasPlayerEndpoint('updateProfile')) {
    throw createMissingEndpointError('actualizacion de perfil de jugador')
  }

  const formData = new FormData()
  formData.append('name', payload.name || '')
  formData.append('phone', payload.phone || '')

  if (payload.profilePhotoFile) {
    formData.append('profile_photo', payload.profilePhotoFile)
  }

  if (payload.removeProfilePhoto) {
    formData.append('remove_profile_photo', '1')
  }

  const { data } = await requestPlayerEndpoint('post', PLAYER_API_ENDPOINTS.updateProfile, {
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
      'X-HTTP-Method-Override': 'PUT',
    },
  })

  return normalizeCustomerProfile(unwrap(data))
}

export async function logoutCustomer() {
  if (PLAYER_API_MODE !== 'api') {
    return mockLogout()
  }

  if (!hasPlayerEndpoint('logout')) {
    return true
  }

  await requestPlayerEndpoint('post', PLAYER_API_ENDPOINTS.logout)
  return true
}
