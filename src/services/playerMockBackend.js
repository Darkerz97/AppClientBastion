import { PLAYER_STORAGE_KEYS } from './playerClientConfig'

const defaultProfile = {
  id: 17,
  user_id: 17,
  name: 'Damian Bastion',
  email: 'cliente@cardbastion.com',
  phone: '555-010-2026',
  role: 'player',
  active: true,
  credit_balance: 240,
  sales_count: 4,
  profile_photo_url: '',
}

const defaultOrders = [
  {
    id: 4108,
    sold_at: '2026-03-28T18:30:00-06:00',
    total: 1399,
    status: 'Pagada',
    order_channel: 'storefront',
    items: [
      { name: 'Booster Box Set Astral', quantity: 1, total: 1099 },
      { name: 'Sleeves Dragon Matte', quantity: 2, total: 300 },
    ],
  },
  {
    id: 4061,
    sold_at: '2026-03-12T16:10:00-06:00',
    total: 420,
    status: 'Entregada',
    order_channel: 'storefront',
    items: [
      { name: 'Bundle de dados premium', quantity: 1, total: 420 },
    ],
  },
]

const defaultPreorders = [
  {
    id: 901,
    title: 'Caja de preventa Legends of Neon',
    total: 1800,
    paid: 900,
    pending: 900,
    status: 'Abonada',
    delivery_status: 'Disponible en lanzamiento',
    created_at: '2026-03-22T13:00:00-06:00',
    items: [{ name: 'Legends of Neon Booster Box', quantity: 1 }],
  },
  {
    id: 874,
    title: 'Collector Tin Ember Clash',
    total: 750,
    paid: 750,
    pending: 0,
    status: 'Pagada',
    delivery_status: 'Entregada',
    created_at: '2026-02-18T11:30:00-06:00',
    items: [{ name: 'Collector Tin Ember Clash', quantity: 1 }],
  },
]

const defaultUpcomingTournaments = [
  {
    id: 71,
    name: 'Liga Modern Abril',
    format: 'Modern',
    starts_at: '2026-04-10T19:00:00-06:00',
    status: 'Abierto',
    published: true,
    registrations_count: 18,
    entry_fee: 180,
    my_registration: null,
  },
  {
    id: 72,
    name: 'Commander Weekend',
    format: 'Commander',
    starts_at: '2026-04-18T16:00:00-06:00',
    status: 'Abierto',
    published: true,
    registrations_count: 26,
    entry_fee: 120,
    my_registration: { status: 'Registrado' },
  },
]

const defaultTournamentHistory = [
  {
    id: 58,
    name: 'Store Championship Marzo',
    format: 'Standard',
    starts_at: '2026-03-08T14:00:00-06:00',
    status: 'Finalizado',
    published: true,
    registrations_count: 32,
    entry_fee: 250,
    my_registration: { status: 'Asistio', result: 'Top 8' },
  },
  {
    id: 54,
    name: 'Draft Friday Night',
    format: 'Draft',
    starts_at: '2026-02-20T19:30:00-06:00',
    status: 'Finalizado',
    published: true,
    registrations_count: 12,
    entry_fee: 220,
    my_registration: { status: 'Asistio', result: '2-1' },
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
  return delay(db.profile)
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

export async function mockGetPreorders() {
  return delay(readDb().preorders)
}

export async function mockGetTournaments() {
  const db = readDb()

  return delay({
    upcoming: db.upcomingTournaments,
    history: db.tournamentHistory,
    stats: db.tournamentStats,
  })
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
        status: 'Registrado',
      },
    }
  })

  writeDb({
    ...db,
    upcomingTournaments: updated,
  })

  return delay(updated.find((item) => `${item.id}` === `${tournamentId}`) || null)
}

export async function mockGetDashboard() {
  const db = readDb()
  const recentOrders = db.orders.slice(0, 2)
  const recentTournaments = db.upcomingTournaments.slice(0, 2)

  return delay({
    profile: db.profile,
    recentOrders,
    recentTournaments,
    preorders: db.preorders,
    stats: db.tournamentStats,
  })
}
