import { defineBoot } from '#q-app'
import axios from 'axios'

// When running inside Electron, main process injects __ELECTRON_API_URL__
// before the page loads. Fall back to VITE_API_URL env var, then localhost.
const API_URL = (
  (typeof window !== 'undefined' && window.__ELECTRON_API_URL__) ||
  import.meta.env.VITE_API_URL ||
  'http://localhost:8000'
).replace(/\/$/, '')

const api = axios.create({
  baseURL: `${API_URL}/api`,
  withCredentials: true,
  withXSRFToken: true,
  headers: { Accept: 'application/json' }
})

// Token-based auth (works under Electron file:// where cookies are unreliable).
// Restore a saved token on startup so the session survives app restarts.
const savedToken = (typeof localStorage !== 'undefined') ? localStorage.getItem('auth_token') : null
if (savedToken) {
  api.defaults.headers.common.Authorization = `Bearer ${savedToken}`
}

api.setToken = (token) => {
  if (token) {
    localStorage.setItem('auth_token', token)
    api.defaults.headers.common.Authorization = `Bearer ${token}`
  } else {
    localStorage.removeItem('auth_token')
    delete api.defaults.headers.common.Authorization
  }
}

// No-op CSRF for desktop token auth; kept so existing callers don't break.
api.getCsrf = () => Promise.resolve()

export default defineBoot(({ app }) => {
  app.config.globalProperties.$api = api
})

export { api }
