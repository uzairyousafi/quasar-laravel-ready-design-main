import { defineStore } from 'pinia'
import { api } from '@/boot/axios'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    permissions: [],
    roles: [],
    ready: false
  }),

  getters: {
    isAuthenticated: (state) => !!state.user,
    currentCompany: (state) => state.user?.company || null,
    can: (state) => (perm) => state.permissions.includes(perm) || state.roles.includes('Super Admin')
  },

  actions: {
    async login (credentials) {
      const { data } = await api.post('/login', credentials)
      if (data.token) api.setToken(data.token)
      this.setSession(data)
      return data
    },

    async fetchUser () {
      try {
        const { data } = await api.get('/user')
        this.setSession(data)
      } catch {
        this.clear()
      } finally {
        this.ready = true
      }
    },

    setSession (data) {
      this.user = data.user
      this.permissions = data.permissions || []
      this.roles = data.roles || []
    },

    async logout () {
      try { await api.post('/logout') } catch { /* ignore */ }
      api.setToken(null)
      this.clear()
    },

    clear () {
      this.user = null
      this.permissions = []
      this.roles = []
      api.setToken(null)
    }
  }
})
