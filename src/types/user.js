/**
 * @typedef {Object} User
 * @property {string|number|null} id
 * @property {string} name
 * @property {string} email
 * @property {string} phone
 * @property {string|null} profilePhotoUrl
 * @property {string|null} role
 * @property {boolean} active
 */

export function normalizeUser(payload = {}) {
  return {
    id: payload.id ?? payload.user_id ?? payload.customer_id ?? null,
    name: payload.name || payload.full_name || payload.customer_name || 'Cliente Card Bastion',
    email: payload.email || '',
    phone: payload.phone || payload.telefono || '',
    profilePhotoUrl:
      payload.profile_photo_url ||
      payload.avatar_url ||
      payload.photo_url ||
      payload.profile_photo_path ||
      null,
    role: payload.role || null,
    active: Boolean(payload.active ?? true),
  }
}
