function normalizeRegistrationStatus(status) {
  const source = `${status || ''}`.trim().toLowerCase()

  if (['paid', 'pagado', 'confirmed', 'confirmado', 'check_in', 'check-in'].includes(source)) {
    return 'paid'
  }

  if (['pending', 'pendiente', 'registered', 'registrado'].includes(source)) {
    return 'pending'
  }

  if (['cancelled', 'cancelado'].includes(source)) {
    return 'cancelled'
  }

  return source || 'not_registered'
}

function normalizeRegistration(payload = {}) {
  if (!payload) {
    return null
  }

  const status = normalizeRegistrationStatus(
    payload.status || payload.payment_status || payload.registration_status,
  )

  return {
    id: payload.id ?? payload.registration_id ?? null,
    status,
    label:
      payload.label ||
      payload.status_label ||
      {
        pending: 'Pendiente de pago',
        paid: 'Inscrito pagado',
        confirmed: 'Check-in confirmado',
        cancelled: 'Registro cancelado',
        not_registered: 'Sin registro',
      }[status] ||
      'Registrado',
    paymentStatus: payload.payment_status || (status === 'pending' ? 'Pendiente' : 'Pagado'),
    paymentPending: Number(payload.payment_pending ?? payload.pending_amount ?? 0) || 0,
    checkInAt: payload.check_in_at || payload.checkInAt || null,
    registeredAt: payload.registered_at || payload.created_at || null,
    finalPosition:
      payload.final_position == null ? null : Number(payload.final_position || payload.position) || 0,
    result: payload.result || payload.record || payload.final_record || '',
    notes: payload.notes || payload.next_steps || '',
  }
}

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
    type: payload.type || payload.tournament_type || 'Evento',
    startsAt: payload.starts_at || payload.start_date || payload.date || null,
    endsAt: payload.ends_at || payload.end_date || null,
    status: payload.status || payload.state || 'Programado',
    published: Boolean(payload.published ?? true),
    registrationsCount:
      Number(payload.registrations_count ?? payload.participants_count ?? payload.participants ?? 0) ||
      0,
    capacity: Number(payload.capacity ?? payload.max_players ?? payload.slots ?? 0) || 0,
    waitlistCount: Number(payload.waitlist_count ?? 0) || 0,
    location: payload.location || payload.venue || 'Card Bastion',
    entryFee: payload.entry_fee == null ? null : Number(payload.entry_fee) || 0,
    prizePool: Number(payload.prize_pool ?? payload.prizes_total ?? 0) || 0,
    description: payload.description || payload.summary || '',
    checkInRequired: Boolean(payload.check_in_required ?? payload.checkInRequired ?? false),
    registrationClosesAt: payload.registration_closes_at || payload.registrationClosesAt || null,
    coverImageUrl: payload.cover_image_url || payload.coverImageUrl || '',
    myRegistration: normalizeRegistration(payload.my_registration || payload.registration || null),
  }
}

export function normalizeTournamentDetail(payload = {}) {
  const base = normalizeTournament(payload)

  return {
    ...base,
    rounds: Number(payload.rounds ?? 0) || 0,
    organizer: payload.organizer || 'Card Bastion',
    rules: Array.isArray(payload.rules) ? payload.rules.filter(Boolean) : [],
    prizes: Array.isArray(payload.prizes) ? payload.prizes.filter(Boolean) : [],
    nextSteps: Array.isArray(payload.next_steps)
      ? payload.next_steps.filter(Boolean)
      : Array.isArray(payload.actions)
        ? payload.actions.filter(Boolean)
        : [],
    standings: Array.isArray(payload.standings)
      ? payload.standings.map((row) => ({
          playerName: row.player_name || row.name || 'Jugador',
          position: Number(row.position ?? 0) || 0,
          record: row.record || '',
          points: Number(row.points ?? 0) || 0,
        }))
      : [],
    itemsIncluded: Array.isArray(payload.items_included || payload.itemsIncluded)
      ? (payload.items_included || payload.itemsIncluded).filter(Boolean)
      : [],
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
