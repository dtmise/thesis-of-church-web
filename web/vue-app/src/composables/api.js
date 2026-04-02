const API_URL = `${window.location.origin}/api`

async function request(endpoint, options = {}) {
  const headers = { 'Content-Type': 'application/json', ...options.headers }

  const res = await fetch(`${API_URL}${endpoint}`, { ...options, headers, credentials: 'include' })
  const data = await res.json()
  if (res.status === 401 && !endpoint.startsWith('/auth/')) {
    localStorage.removeItem('user')
    window.location.href = '/'
    throw new Error('Сессия истекла')
  }
  if (!res.ok) throw new Error(data.error || 'Ошибка запроса')
  return data
}

export const api = {
  login: (creds) => request('/auth/login', { method: 'POST', body: JSON.stringify(creds) }),
  register: (data) => request('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
  logout: () => request('/auth/logout', { method: 'POST' }),
  getProfile: () => request('/auth/me'),
  getTeams: () => request('/teams'),
  getNews: () => request('/news'),
  createTeam: (name) => request('/teams', { method: 'POST', body: JSON.stringify({ name }) }),
  joinTeam: (inviteCode) => request('/teams/join', { method: 'POST', body: JSON.stringify({ inviteCode }) }),
  deleteTeam: () => request('/teams', { method: 'DELETE' }),
  leaveTeam: () => request('/teams/leave', { method: 'POST' }),
  updateProfile: (data) => request('/profile', { method: 'PUT', body: JSON.stringify(data) }),
  updateEmail: (email) => request('/profile/email', { method: 'PUT', body: JSON.stringify({ email }) }),
  updatePassword: (oldPassword, newPassword) => request('/profile/password', { method: 'PUT', body: JSON.stringify({ oldPassword, newPassword }) }),
  updateTeamName: (name) => request('/profile/team-name', { method: 'PUT', body: JSON.stringify({ name }) }),
  submitContact: (data) => request('/contacts', { method: 'POST', body: JSON.stringify(data) }),

  // Admin
  adminGetUsers: () => request('/admin/users'),
  adminGetTeams: () => request('/admin/teams'),
  adminGetNews: () => request('/admin/news'),
  adminCreateNews: (title, content) => request('/admin/news', { method: 'POST', body: JSON.stringify({ title, content }) }),
  adminUpdateNews: (id, title, content) => request(`/admin/news/${id}`, { method: 'PUT', body: JSON.stringify({ title, content }) }),
  adminDeleteNews: (id) => request(`/admin/news/${id}`, { method: 'DELETE' }),
  adminSetAdmin: (userId, isAdmin) => request(`/admin/users/${userId}/admin`, { method: 'PATCH', body: JSON.stringify({ isAdmin }) }),
  adminGetContacts: () => request('/admin/contacts')
}
