import { normalizePreorder, normalizePreorderDetail } from '../types/preorder'
import { PLAYER_API_ENDPOINTS, PLAYER_API_MODE, hasPlayerEndpoint } from './playerClientConfig'
import { mockGetPreorderDetail, mockGetPreorders } from './playerMockBackend'
import { requestPlayerEndpoint } from './playerHttp'
import { createMissingEndpointError } from '../utils/serviceError'

function unwrap(payload) {
  return payload?.data ?? payload
}

function pickPreorders(payload) {
  const data = unwrap(payload)
  const list = data?.preorders || data?.items || data?.data || data

  return Array.isArray(list) ? list.map(normalizePreorder) : []
}

export async function getCustomerPreorders() {
  if (PLAYER_API_MODE !== 'api') {
    return (await mockGetPreorders()).map(normalizePreorder)
  }

  if (!hasPlayerEndpoint('preorders')) {
    throw createMissingEndpointError('preventas del jugador')
  }

  const { data } = await requestPlayerEndpoint('get', PLAYER_API_ENDPOINTS.preorders)
  return pickPreorders(data)
}

export async function getPreorderDetail(preorderId) {
  if (PLAYER_API_MODE !== 'api') {
    return normalizePreorderDetail(await mockGetPreorderDetail(preorderId) || {})
  }

  if (!hasPlayerEndpoint('preorderDetail')) {
    throw createMissingEndpointError('detalle de preventa')
  }

  const endpoint = PLAYER_API_ENDPOINTS.preorderDetail.replace(':preorderId', preorderId)
  const { data } = await requestPlayerEndpoint('get', endpoint)
  return normalizePreorderDetail(unwrap(data))
}
