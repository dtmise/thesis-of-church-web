const API_URL = `${window.location.origin}/api`

async function request(endpoint, options = {}) {
  const token = localStorage.getItem('token')
  const headers = { 'Content-Type': 'application/json', ...options.headers }
  if (token) headers['Authorization'] = `Bearer ${token}`

  const res = await fetch(`${API_URL}${endpoint}`, { ...options, headers })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Ошибка запроса')
  return data
}

export const api = {
  login: (creds) => request('/auth/login', { method: 'POST', body: JSON.stringify(creds) }),
  register: (data) => request('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
  getProfile: () => request('/auth/me'),
  getTeams: () => request('/teams'),
  getNews: () => request('/news'),
  createTeam: (name) => request('/teams', { method: 'POST', body: JSON.stringify({ name }) }),
  joinTeam: (inviteCode) => request('/teams/join', { method: 'POST', body: JSON.stringify({ inviteCode }) }),
  updateProfile: (data) => request('/profile', { method: 'PUT', body: JSON.stringify(data) }),
  updateEmail: (email) => request('/profile/email', { method: 'PUT', body: JSON.stringify({ email }) }),
  updatePassword: (oldPassword, newPassword) => request('/profile/password', { method: 'PUT', body: JSON.stringify({ oldPassword, newPassword }) }),
  updateTeamName: (name) => request('/profile/team-name', { method: 'PUT', body: JSON.stringify({ name }) }),
  submitContact: (data) => request('/contacts', { method: 'POST', body: JSON.stringify(data) })
}
