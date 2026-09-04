import axios from 'axios'
import { getApiBaseUrl } from '../config/apiUrl'
import { TOKEN_KEY } from '../types'

export const httpClient = axios.create({
  headers: { 'Content-Type': 'application/json' },
})

httpClient.interceptors.request.use((config) => {
  config.baseURL = getApiBaseUrl()
  const token = localStorage.getItem(TOKEN_KEY)
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export function getApiErrorMessage(err: unknown): string {
  if (axios.isAxiosError(err)) {
    if (err.response?.status === 401) {
      return 'Usuario o contraseña incorrectos.'
    }
    if (err.response?.status === 403) {
      return 'No tienes permisos para eliminar este proyecto. Solo el propietario o un ADMIN puede hacerlo.'
    }
    if (err.response?.status === 404) {
      return 'El proyecto no existe o la URL de la API no es correcta.'
    }
    if (err.response?.status === 405) {
      return 'La API no permite DELETE en esta ruta.'
    }
    const status = err.response?.status ?? 'network'
    return `Error HTTP ${status}: ${err.message}`
  }
  return err instanceof Error ? err.message : 'Error desconocido'
}











