import { Capacitor } from '@capacitor/core'
import { Browser } from '@capacitor/browser'
import { RESOLVED_SITE_BASE_URL, buildAbsoluteUrl } from './axios'

const appSchemeCallback =
  import.meta.env.VITE_APP_AUTH_CALLBACK_URL || 'com.cardbastion.clientes://auth/callback'

export function getGoogleAuthUrl(mode = 'login') {
  const baseUrl = new URL(buildAbsoluteUrl(RESOLVED_SITE_BASE_URL || 'https://www.cardbastion.com', '/auth/google'))

  if (mode === 'register') {
    baseUrl.searchParams.set('intent', 'register')
  }

  if (Capacitor.isNativePlatform()) {
    baseUrl.searchParams.set('platform', 'capacitor')
    baseUrl.searchParams.set('redirect_uri', appSchemeCallback)
  }

  return baseUrl.toString()
}

export async function openGoogleAuth(mode = 'login') {
  const url = getGoogleAuthUrl(mode)

  if (Capacitor.isNativePlatform()) {
    await Browser.open({
      url,
      presentationStyle: 'fullscreen',
    })
    return
  }

  window.location.assign(url)
}
