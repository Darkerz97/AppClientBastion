import { normalizeUser } from './user'

/**
 * @typedef {Object} CustomerProfile
 * @property {string|number|null} id
 * @property {string|number|null} userId
 * @property {string} name
 * @property {string} email
 * @property {string} phone
 * @property {string|null} profilePhotoUrl
 * @property {number} creditBalance
 * @property {number} salesCount
 * @property {string|null} role
 * @property {boolean} active
 */

export function normalizeCustomerProfile(payload = {}) {
  const user = normalizeUser(payload)

  return {
    ...user,
    userId: payload.user_id ?? payload.userId ?? user.id ?? null,
    creditBalance: Number(payload.credit_balance ?? payload.balance ?? 0) || 0,
    salesCount: Number(payload.sales_count ?? payload.orders_count ?? 0) || 0,
  }
}
