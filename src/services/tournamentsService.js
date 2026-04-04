import { normalizeTournament, normalizeTournamentStats } from '../types/tournament'
import { PLAYER_API_ENDPOINTS, PLAYER_API_MODE, hasPlayerEndpoint } from './playerClientConfig'
import { mockGetTournaments, mockRegisterToTournament } from './playerMockBackend'
import { requestPlayerEndpoint } from './playerHttp'
import { createMissingEndpointError } from '../utils/serviceError'

function unwrap(payload) {
  return payload?.data ?? payload
}

function normalizeTournamentsResponse(payload) {
  const data = unwrap(payload)
  const upcoming = Array.isArray(data?.upcoming)
    ? data.upcoming.map(normalizeTournament)
    : Array.isArray(data?.available)
      ? data.available.map(normalizeTournament)
      : []
  const history = Array.isArray(data?.history)
    ? data.history.map(normalizeTournament)
    : Array.isArray(data?.attended)
      ? data.attended.map(normalizeTournament)
      : Array.isArray(data?.mine)
        ? data.mine.map(normalizeTournament)
        : []

  return {
    upcoming,
    history,
    stats: normalizeTournamentStats(data?.stats || data?.player_stats || {}),
  }
}

export async function getCustomerTournaments() {
  if (PLAYER_API_MODE !== 'api') {
    return normalizeTournamentsResponse(await mockGetTournaments())
  }

  if (!hasPlayerEndpoint('tournaments')) {
    throw createMissingEndpointError('torneos del jugador')
  }

  const { data } = await requestPlayerEndpoint('get', PLAYER_API_ENDPOINTS.tournaments)
  return normalizeTournamentsResponse(data)
}

export async function registerToTournament(tournamentId) {
  if (PLAYER_API_MODE !== 'api') {
    return normalizeTournament(await mockRegisterToTournament(tournamentId))
  }

  if (!hasPlayerEndpoint('tournamentRegister')) {
    throw createMissingEndpointError('inscripcion a torneo')
  }

  const endpoint = PLAYER_API_ENDPOINTS.tournamentRegister.replace(':tournamentId', tournamentId)
  const { data } = await requestPlayerEndpoint('post', endpoint)
  return normalizeTournament(unwrap(data))
}
