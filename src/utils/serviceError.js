import { getApiErrorMessage } from '../api/axios'

export function toServiceError(error, fallback) {
  return getApiErrorMessage(error, fallback)
}

export function createMissingEndpointError(label) {
  const error = new Error(
    `Falta configurar un endpoint publico para ${label}. La app uso el adapter desacoplado para evitar consumir la API privada del POS.`,
  )

  error.code = 'PLAYER_ENDPOINT_MISSING'
  return error
}
