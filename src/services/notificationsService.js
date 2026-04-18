import { normalizeNotification } from '../types/notification'
import { PLAYER_API_ENDPOINTS, PLAYER_API_MODE, hasPlayerEndpoint } from './playerClientConfig'
import { mockGetNotifications, mockMarkNotificationAsRead } from './playerMockBackend'
import { requestPlayerEndpoint } from './playerHttp'
import { createMissingEndpointError } from '../utils/serviceError'

function unwrap(payload) {
  return payload?.data ?? payload
}

export async function getNotifications() {
  if (PLAYER_API_MODE !== 'api') {
    return (await mockGetNotifications()).map(normalizeNotification)
  }

  if (!hasPlayerEndpoint('notifications')) {
    throw createMissingEndpointError('notificaciones del jugador')
  }

  const { data } = await requestPlayerEndpoint('get', PLAYER_API_ENDPOINTS.notifications)
  const payload = unwrap(data)
  const list = payload?.notifications || payload?.items || payload

  return Array.isArray(list) ? list.map(normalizeNotification) : []
}

export async function markNotificationAsRead(notificationId) {
  if (PLAYER_API_MODE !== 'api') {
    return normalizeNotification(await mockMarkNotificationAsRead(notificationId) || {})
  }

  if (!hasPlayerEndpoint('markNotificationRead')) {
    throw createMissingEndpointError('marcar notificacion como leida')
  }

  const endpoint = PLAYER_API_ENDPOINTS.markNotificationRead.replace(':notificationId', notificationId)
  const { data } = await requestPlayerEndpoint('post', endpoint)
  return normalizeNotification(unwrap(data))
}
