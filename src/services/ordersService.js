import { normalizeOrder } from '../types/order'
import { PLAYER_API_ENDPOINTS, PLAYER_API_MODE, hasPlayerEndpoint } from './playerClientConfig'
import { mockGetOrders } from './playerMockBackend'
import { requestPlayerEndpoint } from './playerHttp'
import { createMissingEndpointError } from '../utils/serviceError'

function unwrap(payload) {
  return payload?.data ?? payload
}

function pickOrders(payload) {
  const data = unwrap(payload)
  const list = data?.orders || data?.sales || data?.items || data?.data || data

  return Array.isArray(list) ? list.map(normalizeOrder) : []
}

export async function getCustomerOrders() {
  if (PLAYER_API_MODE !== 'api') {
    return (await mockGetOrders()).map(normalizeOrder)
  }

  if (!hasPlayerEndpoint('orders')) {
    throw createMissingEndpointError('compras del jugador')
  }

  const { data } = await requestPlayerEndpoint('get', PLAYER_API_ENDPOINTS.orders)
  return pickOrders(data)
}
