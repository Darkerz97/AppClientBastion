import api from './axios'

function unwrap(payload) {
  return payload?.data ?? payload
}

function pickProducts(payload) {
  const data = unwrap(payload)
  const list = data?.products || data?.items || data?.data || data

  return Array.isArray(list) ? list : []
}

export async function getArticles(params = {}) {
  const { data } = await api.get('/products', {
    params,
  })

  return pickProducts(data)
}
