import { reactive } from 'vue'
import { api } from './api'

export const auth = reactive({
  user: JSON.parse(localStorage.getItem('user') || 'null'),
  token: localStorage.getItem('token') || null,

  get isAuthenticated() {
    return !!this.token
  },

  setSession(token, user) {
    this.token = token
    this.user = user
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(user))
    localStorage.setItem('hasLoggedIn', '1')
  },

  logout() {
    this.token = null
    this.user = null
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  },

  async login(email, password) {
    const data = await api.login({ email, password })
    this.setSession(data.token, data.user)
    return data.user
  },

  async register(fullName, group, email, password) {
    const data = await api.register({ fullName, group, email, password })
    this.setSession(data.token, data.user)
    return data.user
  },

  async refreshProfile() {
    const profile = await api.getProfile()
    this.user = profile
    localStorage.setItem('user', JSON.stringify(profile))
    return profile
  }
})
