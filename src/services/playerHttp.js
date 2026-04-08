import axios from 'axios'
import api, {
  RESOLVED_API_BASE_URL,
  RESOLVED_SITE_BASE_URL,
  buildAbsoluteUrl,
  siteApi,
} from '../api/axios'

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
      url: buildAbsoluteUrl(RESOLVED_SITE_BASE_URL, endpoint),
      ...config,
    })
  }

  return api({
    method,
    url: buildAbsoluteUrl(RESOLVED_API_BASE_URL, endpoint),
    ...config,
  })
}
