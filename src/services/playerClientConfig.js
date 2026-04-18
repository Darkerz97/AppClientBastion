export const PLAYER_STORAGE_KEYS = {
  session: 'cardbastion.player.session',
  profile: 'cardbastion.player.profile',
}

const apiMode = `${import.meta.env.VITE_PLAYER_API_MODE || 'mock'}`.trim().toLowerCase()

export const PLAYER_API_MODE = apiMode === 'api' ? 'api' : 'mock'

export const PLAYER_API_ENDPOINTS = {
  login: import.meta.env.VITE_PLAYER_AUTH_LOGIN_PATH || '',
  register: import.meta.env.VITE_PLAYER_AUTH_REGISTER_PATH || '',
  currentProfile: import.meta.env.VITE_PLAYER_PROFILE_ME_PATH || '',
  updateProfile: import.meta.env.VITE_PLAYER_PROFILE_UPDATE_PATH || '',
  logout: import.meta.env.VITE_PLAYER_AUTH_LOGOUT_PATH || '',
  dashboard: import.meta.env.VITE_PLAYER_DASHBOARD_PATH || '',
  orders: import.meta.env.VITE_PLAYER_ORDERS_PATH || '',
  orderDetail: import.meta.env.VITE_PLAYER_ORDER_DETAIL_PATH || '',
  tournaments: import.meta.env.VITE_PLAYER_TOURNAMENTS_PATH || '',
  tournamentDetail: import.meta.env.VITE_PLAYER_TOURNAMENT_DETAIL_PATH || '',
  tournamentRegister: import.meta.env.VITE_PLAYER_TOURNAMENT_REGISTER_PATH || '',
  preorders: import.meta.env.VITE_PLAYER_PREORDERS_PATH || '',
  preorderDetail: import.meta.env.VITE_PLAYER_PREORDER_DETAIL_PATH || '',
  rewards: import.meta.env.VITE_PLAYER_REWARDS_PATH || '',
  tiers: import.meta.env.VITE_PLAYER_TIERS_PATH || '',
  notifications: import.meta.env.VITE_PLAYER_NOTIFICATIONS_PATH || '',
  markNotificationRead: import.meta.env.VITE_PLAYER_NOTIFICATION_READ_PATH || '',
}

export function hasPlayerEndpoint(key) {
  return Boolean(PLAYER_API_ENDPOINTS[key])
}
