import api from './axios'

function unwrap(payload) {
  return payload?.data ?? payload
}

function pickToken(payload) {
  if (!payload || typeof payload !== 'object') {
    return null
  }

  return (
    payload.token ||
    payload.access_token ||
    payload.accessToken ||
    pickToken(payload.data) ||
    null
  )
}

function pickCustomer(payload) {
  const data = unwrap(payload)

  return data?.customer || data?.user || data?.profile || data?.data || data || null
}

export async function loginCustomer(credentials) {
  const { data } = await api.post('/auth/login', {
    ...credentials,
    device_name: 'card-bastion-pwa',
  })

  return {
    token: pickToken(data),
    customer: pickCustomer(data),
  }
}

export async function getCurrentCustomer() {
  const { data } = await api.get('/auth/me')
  return pickCustomer(data)
}
