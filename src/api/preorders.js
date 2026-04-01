import api from './axios'

function unwrap(payload) {
  return payload?.data ?? payload
}

function pickPreorders(payload) {
  const data = unwrap(payload)
  const list = data?.preorders || data?.items || data?.data || data

  return Array.isArray(list) ? list : []
}

export async function getCustomerPreorders() {
  const { data } = await api.get('/preorders')
  return pickPreorders(data)
}
