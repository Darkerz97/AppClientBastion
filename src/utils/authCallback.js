export function parseAuthCallbackUrl(rawUrl) {
  if (!rawUrl) {
    return null
  }

  const url = new URL(rawUrl)
  const error = url.searchParams.get('error')

  if (error) {
    return {
      error,
    }
  }

  const token = url.searchParams.get('token')

  if (!token) {
    return null
  }

  const name = url.searchParams.get('name')
  const email = url.searchParams.get('email')
  const phone = url.searchParams.get('phone')
  const profilePhotoUrl =
    url.searchParams.get('profile_photo_url') ||
    url.searchParams.get('avatar_url') ||
    url.searchParams.get('photo_url') ||
    ''

  const customer =
    name || email || phone || profilePhotoUrl
      ? {
          name: name || 'Cliente',
          email: email || '',
          phone: phone || '',
          profile_photo_url: profilePhotoUrl || null,
          avatar_url: profilePhotoUrl || null,
          photo_url: profilePhotoUrl || null,
        }
      : null

  return {
    token,
    customer,
  }
}
