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

import { RESOLVED_SITE_BASE_URL, buildAbsoluteUrl } from '../api/axios'

function resolveProfilePhotoUrl(payload = {}) {
  const rawUrl =
    payload.profile_photo_url ||
    payload.avatar_url ||
    payload.photo_url ||
    payload.profile_photo_path ||
    null

  if (!rawUrl) {
    return null
  }

  if (/^https?:\/\//i.test(rawUrl)) {
    return rawUrl
  }

  return buildAbsoluteUrl(RESOLVED_SITE_BASE_URL || 'https://www.cardbastion.com', rawUrl)
}

export function normalizeUser(payload = {}) {
  return {
    id: payload.id ?? payload.user_id ?? payload.customer_id ?? null,
    name: payload.name || payload.full_name || payload.customer_name || 'Cliente Card Bastion',
    email: payload.email || '',
    phone: payload.phone || payload.telefono || '',
    profilePhotoUrl: resolveProfilePhotoUrl(payload),
    role: payload.role || null,
    active: Boolean(payload.active ?? true),
  }
}
