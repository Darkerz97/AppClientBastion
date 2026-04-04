import { normalizeCustomerProfile } from '../types/customerProfile'
import { normalizeOrder } from '../types/order'
import { normalizePreorder } from '../types/preorder'
import { normalizeTournament, normalizeTournamentStats } from '../types/tournament'
import { PLAYER_API_ENDPOINTS, PLAYER_API_MODE, hasPlayerEndpoint } from './playerClientConfig'
import { mockGetDashboard } from './playerMockBackend'
import { requestPlayerEndpoint } from './playerHttp'
import { createMissingEndpointError } from '../utils/serviceError'

function unwrap(payload) {
  return payload?.data ?? payload
}

function normalizeDashboard(payload) {
  const data = unwrap(payload)

  return {
    profile: normalizeCustomerProfile(data?.profile || {}),
    recentOrders: Array.isArray(data?.recentOrders || data?.recent_orders)
      ? (data?.recentOrders || data?.recent_orders).map(normalizeOrder)
      : [],
    recentTournaments: Array.isArray(data?.recentTournaments || data?.recent_tournaments)
      ? (data?.recentTournaments || data?.recent_tournaments).map(normalizeTournament)
      : [],
    preorders: Array.isArray(data?.preorders) ? data.preorders.map(normalizePreorder) : [],
    stats: normalizeTournamentStats(data?.stats || {}),
  }
}

export async function getCustomerDashboard() {
  if (PLAYER_API_MODE !== 'api') {
    return normalizeDashboard(await mockGetDashboard())
  }

  if (!hasPlayerEndpoint('dashboard')) {
    throw createMissingEndpointError('dashboard del jugador')
  }

  const { data } = await requestPlayerEndpoint('get', PLAYER_API_ENDPOINTS.dashboard)
  return normalizeDashboard(data)
}
