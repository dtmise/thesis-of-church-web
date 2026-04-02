import { reactive } from 'vue'
import { api } from './api'

export const auth = reactive({
  user: JSON.parse(localStorage.getItem('user') || 'null'),

  get isAuthenticated() {
    return !!this.user
  },

  setSession(user) {
    this.user = user
    localStorage.setItem('user', JSON.stringify(user))
    localStorage.setItem('hasLoggedIn', '1')
  },

  async logout() {
    this.user = null
    localStorage.removeItem('user')
    api.logout().catch(() => {})
  },

  async login(email, password) {
    const data = await api.login({ email, password })
    this.setSession(data.user)
    return data.user
  },

  async register(fullName, group, email, password) {
    const data = await api.register({ fullName, group, email, password })
    this.setSession(data.user)
    return data.user
  },

  async refreshProfile() {
    const profile = await api.getProfile()
    this.user = profile
    localStorage.setItem('user', JSON.stringify(profile))
    return profile
  }
})
