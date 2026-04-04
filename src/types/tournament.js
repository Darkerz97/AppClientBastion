/**
 * @typedef {Object} Tournament
 * @property {string|number|null} id
 * @property {string} name
 * @property {string} format
 * @property {string|null} startsAt
 * @property {string} status
 * @property {boolean} published
 * @property {number} registrationsCount
 * @property {number|null} entryFee
 * @property {Object|null} myRegistration
 */

/**
 * @typedef {Object} TournamentStats
 * @property {number} attended
 * @property {number} matchesPlayed
 * @property {number} wins
 * @property {number} losses
 * @property {number} draws
 * @property {number} winStreak
 * @property {number} wlRate
 */

export function normalizeTournament(payload = {}) {
  return {
    id: payload.id ?? payload.tournament_id ?? null,
    name: payload.name || payload.title || 'Torneo Card Bastion',
    format: payload.format || payload.game_format || 'Formato por confirmar',
    startsAt: payload.starts_at || payload.start_date || payload.date || null,
    status: payload.status || payload.state || 'Programado',
    published: Boolean(payload.published ?? true),
    registrationsCount:
      Number(payload.registrations_count ?? payload.participants_count ?? payload.participants ?? 0) ||
      0,
    entryFee: payload.entry_fee == null ? null : Number(payload.entry_fee) || 0,
    myRegistration: payload.my_registration || payload.registration || null,
  }
}

export function normalizeTournamentStats(payload = {}) {
  return {
    attended: Number(payload.attended ?? payload.tournaments_played ?? 0) || 0,
    matchesPlayed: Number(payload.matches_played ?? payload.matches ?? 0) || 0,
    wins: Number(payload.wins ?? 0) || 0,
    losses: Number(payload.losses ?? 0) || 0,
    draws: Number(payload.draws ?? 0) || 0,
    winStreak: Number(payload.win_streak ?? 0) || 0,
    wlRate: Number(payload.wl_rate ?? payload.win_rate ?? 0) || 0,
  }
}
