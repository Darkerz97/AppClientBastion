import { normalizeRewardMovement, normalizeRewardSummary } from '../types/reward'
import { PLAYER_API_ENDPOINTS, PLAYER_API_MODE, hasPlayerEndpoint } from './playerClientConfig'
import { mockGetRewards } from './playerMockBackend'
import { requestPlayerEndpoint } from './playerHttp'
import { createMissingEndpointError } from '../utils/serviceError'

function unwrap(payload) {
  return payload?.data ?? payload
}

export async function getRewardsOverview() {
  if (PLAYER_API_MODE !== 'api') {
    const data = await mockGetRewards()
    return {
      summary: normalizeRewardSummary(data.summary),
      movements: data.movements.map(normalizeRewardMovement),
    }
  }

  if (!hasPlayerEndpoint('rewards')) {
    throw createMissingEndpointError('recompensas del jugador')
  }

  const { data } = await requestPlayerEndpoint('get', PLAYER_API_ENDPOINTS.rewards)
  const payload = unwrap(data)

  return {
    summary: normalizeRewardSummary(payload.summary || payload),
    movements: Array.isArray(payload.movements)
      ? payload.movements.map(normalizeRewardMovement)
      : [],
  }
}
