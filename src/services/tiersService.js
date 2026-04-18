import { normalizeTierProgress } from '../types/tier'
import { PLAYER_API_ENDPOINTS, PLAYER_API_MODE, hasPlayerEndpoint } from './playerClientConfig'
import { mockGetTierProgress } from './playerMockBackend'
import { requestPlayerEndpoint } from './playerHttp'
import { createMissingEndpointError } from '../utils/serviceError'

function unwrap(payload) {
  return payload?.data ?? payload
}

export async function getTierProgress() {
  if (PLAYER_API_MODE !== 'api') {
    return normalizeTierProgress(await mockGetTierProgress())
  }

  if (!hasPlayerEndpoint('tiers')) {
    throw createMissingEndpointError('tiers del jugador')
  }

  const { data } = await requestPlayerEndpoint('get', PLAYER_API_ENDPOINTS.tiers)
  return normalizeTierProgress(unwrap(data))
}
