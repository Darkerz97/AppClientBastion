import { PLAYER_STORAGE_KEYS } from './playerClientConfig'

const defaultTierCatalog = [
  {
    code: 'bronze',
    name: 'Bronce',
    level: 1,
    min_points: 0,
    max_points: 499,
    accent_color: '#b77734',
    benefits: ['Acceso a promociones base', 'Registro rapido en eventos'],
  },
  {
    code: 'silver',
    name: 'Plata',
    level: 2,
    min_points: 500,
    max_points: 1199,
    accent_color: '#93a7c3',
    benefits: ['5% extra en puntos por compra', 'Prioridad en preventas seleccionadas'],
  },
  {
    code: 'gold',
    name: 'Oro',
    level: 3,
    min_points: 1200,
    max_points: 2499,
    accent_color: '#f2b138',
    benefits: ['10% extra en puntos', 'Acceso preferente a torneos premium'],
  },
  {
    code: 'diamond',
    name: 'Diamante',
    level: 4,
    min_points: 2500,
    max_points: 999999,
    accent_color: '#79d5ff',
    benefits: ['15% extra en puntos', 'Invitaciones y recompensas exclusivas'],
  },
]

const defaultProfile = {
  id: 17,
  user_id: 17,
  name: 'Damian Bastion',
  email: 'cliente@cardbastion.com',
  phone: '555-010-2026',
  role: 'player',
  active: true,
  account_status: 'Cuenta al corriente',
  credit_balance: 240,
  available_credit: 240,
  reward_points: 1320,
  sales_count: 4,
  tier_name: 'Oro',
  tier_code: 'gold',
  profile_photo_url: '',
}

const defaultOrders = [
  {
    id: 4108,
    sold_at: '2026-03-28T18:30:00-06:00',
    total: 1399,
    status: 'Pagada',
    order_channel: 'storefront',
    payment_method: 'Tarjeta',
    rewards_generated: 140,
    items: [
      { name: 'Booster Box Set Astral', quantity: 1, total: 1099 },
      { name: 'Sleeves Dragon Matte', quantity: 2, total: 300 },
    ],
    payments: [{ method: 'Tarjeta', amount: 1399, status: 'Aprobado', reference: 'CB-4108' }],
    summary: 'Compra en mostrador con promocion de lanzamiento.',
  },
  {
    id: 4061,
    sold_at: '2026-03-12T16:10:00-06:00',
    total: 420,
    status: 'Entregada',
    order_channel: 'storefront',
    payment_method: 'Efectivo',
    rewards_generated: 42,
    items: [{ name: 'Bundle de dados premium', quantity: 1, total: 420 }],
    payments: [{ method: 'Efectivo', amount: 420, status: 'Aplicado', reference: 'CB-4061' }],
    summary: 'Accesorios para liga semanal.',
  },
]

const defaultPreorders = [
  {
    id: 901,
    title: 'Caja de preventa Legends of Neon',
    total: 1800,
    paid: 900,
    pending: 900,
    payment_progress: 50,
    status: 'Abonada',
    status_label: 'Pago pendiente',
    delivery_status: 'Disponible en lanzamiento',
    delivery_date: '2026-05-02T12:00:00-06:00',
    created_at: '2026-03-22T13:00:00-06:00',
    notes: 'Liquida antes del 30 de abril para asegurar producto.',
    alerts: ['Faltan $900 para liquidar tu apartado.'],
    items: [{ id: 1, name: 'Legends of Neon Booster Box', quantity: 1, unit_price: 1800, total: 1800 }],
  },
  {
    id: 874,
    title: 'Collector Tin Ember Clash',
    total: 750,
    paid: 750,
    pending: 0,
    payment_progress: 100,
    status: 'Pagada',
    status_label: 'Lista para recoger',
    delivery_status: 'Entregada',
    delivery_date: '2026-02-20T16:30:00-06:00',
    created_at: '2026-02-18T11:30:00-06:00',
    notes: 'Producto recogido en tienda.',
    alerts: [],
    items: [{ id: 2, name: 'Collector Tin Ember Clash', quantity: 1, unit_price: 750, total: 750 }],
  },
]

const defaultUpcomingTournaments = [
  {
    id: 71,
    name: 'Liga Modern Abril',
    format: 'Modern',
    type: 'Liga semanal',
    starts_at: '2026-04-24T19:00:00-06:00',
    ends_at: '2026-04-24T23:00:00-06:00',
    status: 'Abierto',
    published: true,
    capacity: 32,
    registrations_count: 18,
    entry_fee: 180,
    prize_pool: 2500,
    location: 'Card Bastion Satelite',
    description: 'Evento competitivo con rondas suizas y top cut.',
    check_in_required: true,
    registration_closes_at: '2026-04-24T18:30:00-06:00',
    my_registration: null,
    rules: ['Decklist requerida', '3 rondas minimo'],
    prizes: ['Store credit para Top 8', 'Promo para participantes'],
    next_steps: ['Registra tu pago en caja antes del torneo'],
    items_included: ['Entry al evento'],
  },
  {
    id: 72,
    name: 'Commander Weekend',
    format: 'Commander',
    type: 'Casual con premios',
    starts_at: '2026-04-26T16:00:00-06:00',
    ends_at: '2026-04-26T20:00:00-06:00',
    status: 'Abierto',
    published: true,
    capacity: 40,
    registrations_count: 26,
    entry_fee: 120,
    prize_pool: 1800,
    location: 'Card Bastion Centro',
    description: 'Mesa casual con rondas por pods y premios aleatorios.',
    check_in_required: false,
    registration_closes_at: '2026-04-26T15:50:00-06:00',
    my_registration: {
      id: 7002,
      status: 'paid',
      payment_status: 'Pagado',
      registered_at: '2026-04-12T10:20:00-06:00',
      notes: 'Presentate 15 minutos antes para asiento asignado.',
    },
    rules: ['Lista casual permitida', 'Respeto de tiempos de ronda'],
    prizes: ['Sobres y creditos por mesas destacadas'],
    next_steps: ['Llega 15 minutos antes del evento'],
    items_included: ['Entrada', 'Promo por registro anticipado'],
  },
]

const defaultTournamentHistory = [
  {
    id: 58,
    name: 'Store Championship Marzo',
    format: 'Standard',
    type: 'Championship',
    starts_at: '2026-03-08T14:00:00-06:00',
    status: 'Finalizado',
    published: true,
    capacity: 32,
    registrations_count: 32,
    entry_fee: 250,
    prize_pool: 4500,
    location: 'Card Bastion Centro',
    my_registration: {
      id: 6558,
      status: 'confirmed',
      label: 'Check-in confirmado',
      result: 'Top 8',
      final_position: 6,
      registered_at: '2026-03-02T18:40:00-06:00',
    },
    standings: [{ player_name: 'Damian Bastion', position: 6, record: '4-2', points: 12 }],
  },
  {
    id: 54,
    name: 'Draft Friday Night',
    format: 'Draft',
    type: 'FNM',
    starts_at: '2026-02-20T19:30:00-06:00',
    status: 'Finalizado',
    published: true,
    capacity: 16,
    registrations_count: 12,
    entry_fee: 220,
    prize_pool: 1600,
    location: 'Card Bastion Satelite',
    my_registration: {
      id: 6454,
      status: 'confirmed',
      label: 'Check-in confirmado',
      result: '2-1',
      final_position: 4,
      registered_at: '2026-02-18T15:15:00-06:00',
    },
    standings: [{ player_name: 'Damian Bastion', position: 4, record: '2-1', points: 6 }],
  },
]

const defaultStats = {
  attended: 7,
  matches_played: 19,
  wins: 11,
  losses: 6,
  draws: 2,
  win_streak: 3,
  wl_rate: 0.579,
}

const defaultRewards = {
  summary: {
    points_balance: 1320,
    credit_balance: 240,
    reward_balance: 1560,
    expiring_points: 120,
    expiring_at: '2026-06-30T23:59:00-06:00',
  },
  movements: [
    {
      id: 1,
      origin: 'compra',
      label: 'Compra en tienda',
      points: 140,
      credit: 0,
      amount: 1399,
      status: 'aplicado',
      occurred_at: '2026-03-28T18:35:00-06:00',
      description: 'Generaste puntos por la compra #4108.',
    },
    {
      id: 2,
      origin: 'torneo',
      label: 'Participacion en Commander Weekend',
      points: 80,
      credit: 40,
      amount: 0,
      status: 'aplicado',
      occurred_at: '2026-04-12T10:21:00-06:00',
      description: 'Bono por registro y asistencia confirmada.',
    },
    {
      id: 3,
      origin: 'premio',
      label: 'Premio de torneo',
      points: 0,
      credit: 120,
      amount: 0,
      status: 'aplicado',
      occurred_at: '2026-03-08T20:15:00-06:00',
      description: 'Store credit por Top 8.',
    },
  ],
}

const defaultNotifications = [
  {
    id: 810,
    title: 'Pago pendiente en preventa',
    message: 'Tu preventa Legends of Neon tiene un saldo pendiente de $900.',
    type: 'preorder',
    created_at: '2026-04-17T09:15:00-06:00',
    action_label: 'Ver preventa',
    action_to: '/preorders/901',
  },
  {
    id: 811,
    title: 'Inscripcion confirmada',
    message: 'Tu lugar para Commander Weekend ya esta pagado.',
    type: 'tournament',
    created_at: '2026-04-16T18:00:00-06:00',
    action_label: 'Ver torneo',
    action_to: '/tournaments/72',
  },
  {
    id: 812,
    title: 'Subiste a tier Oro',
    message: 'Ahora acumulas puntos extra y acceso preferente a preventas.',
    type: 'tier',
    created_at: '2026-04-10T12:00:00-06:00',
    action_label: 'Ver recompensas',
    action_to: '/rewards',
  },
]

function buildTierProgress(points) {
  const tiers = defaultTierCatalog
  const currentTier =
    [...tiers].reverse().find((tier) => points >= tier.min_points) || defaultTierCatalog[0]
  const nextTier = tiers.find((tier) => tier.level === currentTier.level + 1) || null
  const progressBase = currentTier.min_points
  const progressTarget = nextTier?.min_points ?? currentTier.max_points
  const progressPercentage = nextTier
    ? Math.min(100, Math.max(0, ((points - progressBase) / (progressTarget - progressBase)) * 100))
    : 100

  return {
    current_tier: currentTier,
    next_tier: nextTier,
    progress_percentage: progressPercentage,
    points_to_next_tier: nextTier ? Math.max(0, nextTier.min_points - points) : 0,
    current_points: points,
    tracked_metric_label: 'Puntos acumulados',
    history: [
      { date: '2026-01-15T10:00:00-06:00', tier_name: 'Bronce', points: 120 },
      { date: '2026-03-01T10:00:00-06:00', tier_name: 'Plata', points: 620 },
      { date: '2026-04-10T12:00:00-06:00', tier_name: 'Oro', points: points },
    ],
  }
}

function readJson(key, fallback) {
  try {
    const stored = localStorage.getItem(key)
    return stored ? JSON.parse(stored) : fallback
  } catch {
    return fallback
  }
}

function writeJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
}

function ensureSeed() {
  const profile = readJson(PLAYER_STORAGE_KEYS.profile, null)

  if (!profile) {
    writeJson(PLAYER_STORAGE_KEYS.profile, {
      profile: defaultProfile,
      orders: defaultOrders,
      preorders: defaultPreorders,
      upcomingTournaments: defaultUpcomingTournaments,
      tournamentHistory: defaultTournamentHistory,
      tournamentStats: defaultStats,
      rewards: defaultRewards,
      notifications: defaultNotifications,
      tierCatalog: defaultTierCatalog,
    })
  }
}

function readDb() {
  ensureSeed()
  return readJson(PLAYER_STORAGE_KEYS.profile, {
    profile: defaultProfile,
    orders: defaultOrders,
    preorders: defaultPreorders,
    upcomingTournaments: defaultUpcomingTournaments,
    tournamentHistory: defaultTournamentHistory,
    tournamentStats: defaultStats,
    rewards: defaultRewards,
    notifications: defaultNotifications,
    tierCatalog: defaultTierCatalog,
  })
}

function writeDb(db) {
  writeJson(PLAYER_STORAGE_KEYS.profile, db)
}

function createToken(email) {
  return `mock-player-token:${email || 'cliente@cardbastion.com'}`
}

function readSession() {
  return readJson(PLAYER_STORAGE_KEYS.session, null)
}

function writeSession(session) {
  writeJson(PLAYER_STORAGE_KEYS.session, session)
}

function clearSession() {
  localStorage.removeItem(PLAYER_STORAGE_KEYS.session)
}

function delay(value) {
  return new Promise((resolve) => {
    window.setTimeout(() => resolve(value), 220)
  })
}

async function fileToDataUrl(file) {
  if (!file) {
    return ''
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(`${reader.result || ''}`)
    reader.onerror = () => reject(new Error('No fue posible leer la imagen seleccionada.'))
    reader.readAsDataURL(file)
  })
}

function getTournamentById(db, tournamentId) {
  return [...db.upcomingTournaments, ...db.tournamentHistory].find(
    (tournament) => `${tournament.id}` === `${tournamentId}`,
  )
}

function hydrateProfileWithRewards(profile, rewards) {
  return {
    ...profile,
    reward_points: rewards.summary.points_balance,
    available_credit: rewards.summary.credit_balance,
    credit_balance: rewards.summary.credit_balance,
  }
}

export async function mockLogin(credentials) {
  const db = readDb()
  const profile = {
    ...db.profile,
    email: credentials.email || db.profile.email,
  }
  const session = {
    token: createToken(profile.email),
    customer: profile,
  }

  writeSession(session)
  writeDb({ ...db, profile })

  return delay(session)
}

export async function mockRegister(payload) {
  const db = readDb()
  const profile = {
    ...db.profile,
    name: payload.name || db.profile.name,
    email: payload.email || db.profile.email,
    phone: payload.phone || db.profile.phone,
  }
  const session = {
    token: createToken(profile.email),
    customer: profile,
  }

  writeDb({ ...db, profile })
  writeSession(session)

  return delay(session)
}

export async function mockGetCurrentCustomer() {
  const session = readSession()

  if (!session?.token) {
    throw new Error('Tu sesion local de jugador no esta disponible.')
  }

  const db = readDb()
  const profile = hydrateProfileWithRewards(db.profile, db.rewards)
  return delay(profile)
}

export async function mockUpdateProfile(payload) {
  const db = readDb()
  const nextPhotoUrl = payload.removeProfilePhoto
    ? ''
    : payload.profilePhotoFile
      ? await fileToDataUrl(payload.profilePhotoFile)
      : db.profile.profile_photo_url

  const profile = {
    ...db.profile,
    name: payload.name || db.profile.name,
    phone: payload.phone || '',
    profile_photo_url: nextPhotoUrl,
  }

  writeDb({ ...db, profile })

  const session = readSession()

  if (session?.token) {
    writeSession({
      ...session,
      customer: profile,
    })
  }

  return delay(profile)
}

export async function mockLogout() {
  clearSession()
  return delay(true)
}

export async function mockGetOrders() {
  return delay(readDb().orders)
}

export async function mockGetOrderDetail(orderId) {
  return delay(readDb().orders.find((order) => `${order.id}` === `${orderId}`) || null)
}

export async function mockGetPreorders() {
  return delay(readDb().preorders)
}

export async function mockGetPreorderDetail(preorderId) {
  return delay(readDb().preorders.find((preorder) => `${preorder.id}` === `${preorderId}`) || null)
}

export async function mockGetTournaments() {
  const db = readDb()

  return delay({
    upcoming: db.upcomingTournaments,
    history: db.tournamentHistory,
    mine: db.upcomingTournaments.filter((item) => item.my_registration),
    stats: db.tournamentStats,
  })
}

export async function mockGetTournamentDetail(tournamentId) {
  return delay(getTournamentById(readDb(), tournamentId) || null)
}

export async function mockRegisterToTournament(tournamentId) {
  const db = readDb()
  const updated = db.upcomingTournaments.map((tournament) => {
    if (`${tournament.id}` !== `${tournamentId}`) {
      return tournament
    }

    return {
      ...tournament,
      registrations_count: Number(tournament.registrations_count || 0) + 1,
      my_registration: {
        id: Number(`9${tournament.id}`),
        status: 'pending',
        label: 'Inscrito pendiente de pago',
        payment_status: 'Pendiente',
        payment_pending: Number(tournament.entry_fee ?? 0) || 0,
        registered_at: new Date().toISOString(),
        notes: 'Liquida en mostrador para confirmar tu lugar.',
      },
    }
  })

  const notifications = [
    {
      id: Date.now(),
      title: 'Registro creado',
      message: 'Tu registro se creo y esta pendiente de pago.',
      type: 'tournament',
      created_at: new Date().toISOString(),
      action_label: 'Ver torneo',
      action_to: `/tournaments/${tournamentId}`,
    },
    ...db.notifications,
  ]

  writeDb({
    ...db,
    upcomingTournaments: updated,
    notifications,
  })

  return delay(updated.find((item) => `${item.id}` === `${tournamentId}`) || null)
}

export async function mockGetRewards() {
  return delay(readDb().rewards)
}

export async function mockGetTierProgress() {
  const db = readDb()
  return delay(buildTierProgress(db.rewards.summary.points_balance))
}

export async function mockGetNotifications() {
  return delay(readDb().notifications)
}

export async function mockMarkNotificationAsRead(notificationId) {
  const db = readDb()
  const notifications = db.notifications.map((notification) =>
    `${notification.id}` === `${notificationId}`
      ? { ...notification, read_at: new Date().toISOString() }
      : notification,
  )

  writeDb({ ...db, notifications })
  return delay(notifications.find((notification) => `${notification.id}` === `${notificationId}`) || null)
}

export async function mockGetDashboard() {
  const db = readDb()
  const recentOrders = db.orders.slice(0, 2)
  const recentTournaments = db.upcomingTournaments.slice(0, 2)
  const registeredTournaments = db.upcomingTournaments.filter((item) => item.my_registration)
  const profile = hydrateProfileWithRewards(db.profile, db.rewards)

  return delay({
    profile,
    recentOrders,
    recentTournaments,
    registered_tournaments: registeredTournaments,
    preorders: db.preorders,
    rewards: db.rewards.summary,
    tier_progress: buildTierProgress(db.rewards.summary.points_balance),
    notifications: db.notifications,
    stats: db.tournamentStats,
  })
}
