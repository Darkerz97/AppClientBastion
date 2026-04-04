import axios from 'axios'
import api, { siteApi } from '../api/axios'

export async function requestPlayerEndpoint(method, endpoint, config = {}) {
  if (/^https?:\/\//i.test(endpoint)) {
    return axios({
      method,
      url: endpoint,
      ...config,
    })
  }

  if (endpoint.startsWith('/')) {
    return siteApi({
      method,
      url: endpoint,
      ...config,
    })
  }

  return api({
    method,
    url: endpoint,
    ...config,
  })
}
