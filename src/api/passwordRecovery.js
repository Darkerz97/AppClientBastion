import { Capacitor } from '@capacitor/core'
import { Browser } from '@capacitor/browser'
import { RESOLVED_SITE_BASE_URL, buildAbsoluteUrl } from './axios'

function buildSiteUrl(path) {
  return new URL(
    buildAbsoluteUrl(RESOLVED_SITE_BASE_URL || 'https://www.cardbastion.com', path),
  ).toString()
}

export function getPasswordRecoveryUrl(email = '') {
  const url = new URL(buildSiteUrl('/recuperar-contrasena'))

  if (email?.trim()) {
    url.searchParams.set('email', email.trim())
  }

  return url.toString()
}

export function getPasswordResetUrl(token, email = '') {
  const normalizedToken = `${token || ''}`.trim()

  if (!normalizedToken) {
    throw new Error('No se encontro el token para restablecer el password.')
  }

  const url = new URL(buildSiteUrl(`/restablecer-contrasena/${encodeURIComponent(normalizedToken)}`))

  if (email?.trim()) {
    url.searchParams.set('email', email.trim())
  }

  return url.toString()
}

async function openExternalUrl(url) {
  if (Capacitor.isNativePlatform()) {
    await Browser.open({
      url,
      presentationStyle: 'fullscreen',
    })
    return
  }

  window.location.assign(url)
}

export async function openPasswordRecovery(email = '') {
  await openExternalUrl(getPasswordRecoveryUrl(email))
}

export async function openPasswordReset(token, email = '') {
  await openExternalUrl(getPasswordResetUrl(token, email))
}
