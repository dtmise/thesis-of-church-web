<template>
  <div class="dashboard-wrapper">
    <header class="dashboard-header">
      <h1>Church-Turing Thesis</h1>
      <div class="user-info">
        <span class="user-name-display">{{ auth.user?.fullName }}</span>
        <button class="btn-logout" @click="onLogout">Выйти</button>
      </div>
    </header>

    <main class="dashboard-main">
      <div class="blocks-container">
        <!-- Profile -->
        <div class="info-block profile-block">
          <div class="block-icon">П</div>
          <h2>Мой профиль</h2>
          <div v-if="profile" class="profile-info">
            <p><strong>ФИО:</strong> <span>{{ profile.fullName }}</span></p>
            <p><strong>Группа:</strong> <span>{{ profile.group }}</span></p>
            <p><strong>Email:</strong> <span>{{ profile.email }}</span></p>
            <p v-if="profile.role"><strong>Роль:</strong> <span>{{ roleText }}</span></p>
          </div>
          <div v-else class="loading-spinner">Загрузка...</div>
          <button class="btn-edit" @click="openEditModal">Редактировать</button>
        </div>

        <!-- Team (has team) -->
        <div v-if="profile?.team" class="info-block team-block">
          <div class="block-icon">К</div>
          <h2>Моя команда</h2>
          <div class="team-details">
            <div class="team-header-row">
              <div v-if="editingTeamName" class="team-name-edit">
                <form @submit.prevent="changeTeamName" class="team-name-form">
                  <input v-model="teamNameEdit" type="text" required class="team-name-input" @keydown.esc="editingTeamName = false">
                  <button type="submit" class="btn-save-name">✓</button>
                  <button type="button" class="btn-cancel-sm" @click="editingTeamName = false">✕</button>
                </form>
              </div>
              <div v-else class="team-name-display">
                <h3>{{ profile.team.name }}</h3>
                <button v-if="profile.role === 'captain'" class="btn-edit-name" @click="startEditTeamName">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>
                </button>
              </div>
              <span :class="['team-badge', profile.role === 'captain' ? 'badge-captain' : 'badge-member']">
                {{ profile.role === 'captain' ? 'Капитан' : 'Участник' }}
              </span>
            </div>
            <div class="team-stats">
              <p><strong>Участников:</strong> {{ profile.team.members?.length || 0 }} / 3</p>
            </div>

            <!-- Invite link (captain only, hide when team full) -->
            <div v-if="profile.role === 'captain' && profile.team.invite_code && (profile.team.members?.length || 0) < 3" class="invite-section">
              <label><strong>Ссылка-приглашение:</strong></label>
              <div class="invite-link-row">
                <input :value="inviteLink" readonly class="invite-input" @click="$event.target.select()">
                <button type="button" :class="['btn-copy', { 'btn-copy-done': copied }]" @click="copyInvite">{{ copied ? 'Скопировано' : 'Копировать' }}</button>
              </div>
              <div class="input-hint">Отправьте эту ссылку участникам для присоединения к команде</div>
            </div>

            <!-- Team members -->
            <div v-if="profile.team.members?.length" class="team-members-list">
              <h4>Участники</h4>
              <div v-for="m in profile.team.members" :key="m.id" class="team-member-row">
                <span class="member-name">{{ m.fullName }}</span>
                <span v-if="m.role === 'captain'" class="member-role-badge">капитан</span>
                <span class="member-group">{{ m.group }}</span>
              </div>
            </div>

            <!-- Delete / Leave team -->
            <button v-if="profile.role === 'captain'" class="btn-danger-sm" @click="confirmAction = 'delete'">
              Удалить команду
            </button>
            <button v-else class="btn-danger-outline-sm" @click="confirmAction = 'leave'">
              Покинуть команду
            </button>
          </div>
        </div>

        <!-- Team (no team) -->
        <div v-else-if="profile && !profile.team" class="info-block team-block">
          <div class="block-icon">К</div>
          <h2>Команда</h2>
          <div class="no-team-section">
            <p class="empty-state-text">Одному, конечно, тоже можно, но вместе — веселее и эффективнее!</p>

            <!-- Create team -->
            <div class="team-action-card">
              <h3>Создать команду</h3>
              <form @submit.prevent="onCreateTeam">
                <div class="form-group">
                  <input v-model="newTeamName" type="text" placeholder="Название команды" required minlength="3">
                </div>
                <button type="submit" class="btn-primary" :disabled="teamLoading">
                  {{ teamLoading ? 'Создание...' : 'Создать' }}
                </button>
              </form>
            </div>

            <!-- Join team -->
            <div class="team-action-card">
              <h3>Присоединиться</h3>
              <form @submit.prevent="onJoinTeam">
                <div class="form-group">
                  <input v-model="joinCode" type="text" placeholder="Код приглашения" required>
                </div>
                <button type="submit" class="btn-primary" :disabled="teamLoading">
                  {{ teamLoading ? 'Присоединение...' : 'Присоединиться' }}
                </button>
              </form>
            </div>
          </div>
        </div>

        <!-- News -->
        <div class="info-block news-block">
          <div class="block-icon">Н</div>
          <h2>Новости</h2>
          <div v-if="news.length" class="news-list">
            <div v-for="item in news" :key="item.id" class="news-card">
              <div class="news-header">
                <h3>{{ item.title }}</h3>
                <span class="news-date">{{ formatDate(item.publishedAt) }}</span>
              </div>
              <p class="news-content">{{ item.content }}</p>
            </div>
          </div>
          <div v-else-if="!loading" class="empty-state">
            <p>Новостей пока нет</p>
          </div>
          <div v-else class="loading-spinner">Загрузка...</div>
          <div class="news-socials">
            <p class="news-socials-text">Следите за новостями также здесь</p>
            <div class="news-socials-row">
              <a href="https://t.me/+2UInlPHybzhjYzRi" target="_blank" rel="noopener" class="news-social-btn">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.2-.08-.06-.19-.04-.27-.02-.12.03-1.99 1.27-5.62 3.72-.53.36-1.01.54-1.44.53-.47-.01-1.38-.27-2.06-.49-.83-.27-1.49-.42-1.43-.88.03-.24.37-.49 1.02-.74 4-1.73 6.67-2.88 8.02-3.45 3.82-1.6 4.62-1.87 5.13-1.88.11 0 .37.03.53.17.14.12.18.28.2.45-.01.06.01.24 0 .37z" fill="currentColor"/></svg>
                Telegram
              </a>
              <a href="https://vk.com/church_turing_thesis" target="_blank" rel="noopener" class="news-social-btn">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5.01 13.35h-1.3c-.5 0-.65-.4-1.54-1.3-.78-.75-1.12-.85-1.31-.85-.27 0-.35.08-.35.45v1.19c0 .32-.1.51-1 .51-1.47 0-3.1-.89-4.25-2.56-1.73-2.43-2.2-4.26-2.2-4.63 0-.19.08-.36.45-.36h1.3c.34 0 .46.15.59.51.65 1.9 1.74 3.56 2.19 3.56.17 0 .24-.08.24-.51V9.93c-.05-.88-.52-.95-.52-1.26 0-.15.13-.31.33-.31h2.04c.28 0 .38.15.38.49v2.58c0 .28.13.38.21.38.17 0 .31-.1.62-.41.96-1.07 1.64-2.73 1.64-2.73.09-.19.24-.36.58-.36h1.3c.39 0 .48.2.39.49-.17.77-1.81 3.1-1.81 3.1-.14.23-.2.34 0 .6.14.19.62.6.94.97.59.67 1.05 1.23 1.17 1.62.13.38-.07.58-.45.58z" fill="currentColor"/></svg>
                VK
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Edit modal -->
    <div v-if="editOpen" class="modal" style="display:flex;" @click.self="editOpen = false">
      <div class="modal-content">
        <span class="close" @click="editOpen = false">&times;</span>

        <h3>Редактировать профиль</h3>
        <form @submit.prevent="saveProfile">
          <div class="form-group">
            <label>ФИО</label>
            <input v-model="editForm.fullName" type="text" required>
          </div>
          <div class="form-group">
            <label>Группа</label>
            <input v-model="editForm.group" type="text" required>
          </div>
          <div class="form-group">
            <label>Email</label>
            <input v-model="editForm.email" type="email" required>
          </div>
          <button type="submit" class="btn-primary">Сохранить</button>
        </form>

        <hr class="modal-divider">

        <h3>Сменить пароль</h3>
        <form @submit.prevent="changePassword">
          <div class="form-group">
            <label>Текущий пароль</label>
            <input v-model="pwForm.oldPassword" type="password" required>
          </div>
          <div class="form-group">
            <label>Новый пароль</label>
            <input v-model="pwForm.newPassword" type="password" required minlength="4">
          </div>
          <button type="submit" class="btn-primary">Сменить пароль</button>
        </form>

        <template v-if="false">
        </template>
      </div>
    </div>

    <!-- Confirm popup -->
    <div v-if="confirmAction" class="modal" style="display:flex;" @click.self="confirmAction = null">
      <div class="confirm-popup">
        <div class="confirm-icon">!</div>
        <h3>{{ confirmAction === 'delete' ? 'Удалить команду?' : 'Покинуть команду?' }}</h3>
        <p class="confirm-text">
          {{ confirmAction === 'delete'
            ? 'Все участники потеряют привязку к команде. Это действие необратимо.'
            : 'Вы сможете присоединиться к другой команде позже.' }}
        </p>
        <div class="confirm-actions">
          <button class="btn-cancel" @click="confirmAction = null">Отмена</button>
          <button class="btn-confirm-danger" @click="executeConfirm">
            {{ confirmAction === 'delete' ? 'Удалить' : 'Покинуть' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { auth } from '../composables/auth'
import { api } from '../composables/api'
import { useNotification } from '../composables/notification'

const router = useRouter()
const { show: notify } = useNotification()

const loading = ref(true)
const profile = ref(null)
const news = ref([])

// Team management
const teamLoading = ref(false)
const newTeamName = ref('')
const joinCode = ref('')
const copied = ref(false)
const confirmAction = ref(null)
const editingTeamName = ref(false)

// Edit modal state
const editOpen = ref(false)
const editForm = ref({ fullName: '', group: '', email: '' })
const pwForm = ref({ oldPassword: '', newPassword: '' })
const teamNameEdit = ref('')

const roleText = computed(() => {
  if (!profile.value) return ''
  return profile.value.role === 'captain' ? '👑 Капитан команды' : '👤 Участник команды'
})

const inviteLink = computed(() => {
  if (!profile.value?.team?.invite_code) return ''
  return `${window.location.origin}/?invite=${profile.value.team.invite_code}`
})

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

function isValidGroup(value) {
  return /^\d{5}$/.test(value)
}

function formatDate(dateStr) {
  if (!dateStr) return ''
  try {
    const d = new Date(dateStr)
    if (isNaN(d.getTime())) return ''
    const pad = n => String(n).padStart(2, '0')
    return `${pad(d.getDate())}.${pad(d.getMonth()+1)}.${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`
  } catch { return '' }
}

async function loadData() {
  loading.value = true
  try {
    const [p, n] = await Promise.all([
      api.getProfile(),
      api.getNews()
    ])
    profile.value = p
    auth.user = p
    localStorage.setItem('user', JSON.stringify(p))
    news.value = n || []
  } catch (e) {
    notify(e.message || 'Ошибка загрузки', 'error')
  } finally {
    loading.value = false
  }
}

// Auto-join from invite link
async function checkPendingInvite() {
  const invite = sessionStorage.getItem('pendingInvite')
  if (invite && !profile.value?.team) {
    sessionStorage.removeItem('pendingInvite')
    try {
      await api.joinTeam(invite)
      notify('Вы присоединились к команде!', 'success')
      await loadData()
    } catch (e) {
      notify(e.message || 'Не удалось присоединиться', 'error')
    }
  } else if (invite) {
    sessionStorage.removeItem('pendingInvite')
  }
}

async function onCreateTeam() {
  const teamName = newTeamName.value.trim()

  if (!teamName) {
    notify('Укажите название команды', 'error')
    return
  }
  if (teamName.length < 3) {
    notify('Название команды должно быть не короче 3 символов', 'error')
    return
  }

  teamLoading.value = true
  try {
    await api.createTeam(teamName)
    newTeamName.value = ''
    notify('Команда создана!', 'success')
    await loadData()
  } catch (e) {
    notify(e.message || 'Ошибка создания команды', 'error')
  } finally {
    teamLoading.value = false
  }
}

async function onJoinTeam() {
  const inviteCode = joinCode.value.trim()

  if (!inviteCode) {
    notify('Укажите код приглашения', 'error')
    return
  }

  teamLoading.value = true
  try {
    await api.joinTeam(inviteCode)
    joinCode.value = ''
    notify('Вы присоединились к команде!', 'success')
    await loadData()
  } catch (e) {
    notify(e.message || 'Ошибка присоединения к команде', 'error')
  } finally {
    teamLoading.value = false
  }
}

async function executeConfirm() {
  const action = confirmAction.value
  confirmAction.value = null
  if (action === 'delete') {
    try {
      await api.deleteTeam()
      notify('Команда удалена', 'success')
      await loadData()
    } catch (e) {
      notify(e.message || 'Ошибка удаления', 'error')
    }
  } else if (action === 'leave') {
    try {
      await api.leaveTeam()
      notify('Вы покинули команду', 'success')
      await loadData()
    } catch (e) {
      notify(e.message || 'Ошибка', 'error')
    }
  }
}

function copyInvite() {
  navigator.clipboard.writeText(inviteLink.value)
  copied.value = true
  setTimeout(() => { copied.value = false }, 2000)
}

function openEditModal() {
  if (profile.value) {
    editForm.value = {
      fullName: profile.value.fullName,
      group: profile.value.group,
      email: profile.value.email
    }
    pwForm.value = { oldPassword: '', newPassword: '' }
    if (profile.value.team) teamNameEdit.value = profile.value.team.name
  }
  editOpen.value = true
}

async function saveProfile() {
  const fullName = editForm.value.fullName.trim()
  const group = editForm.value.group.trim()
  const email = editForm.value.email.trim()

  if (!fullName || fullName.length < 2) {
    notify('Укажите ФИО', 'error')
    return
  }
  if (!group) {
    notify('Укажите группу', 'error')
    return
  }
  if (!isValidGroup(group)) {
    notify('Группа должна состоять из 5 цифр', 'error')
    return
  }
  if (!email) {
    notify('Укажите email', 'error')
    return
  }
  if (!isValidEmail(email)) {
    notify('Укажите корректный email', 'error')
    return
  }

  try {
    await api.updateProfile({ fullName, group })
    await api.updateEmail(email)
    await loadData()
    editOpen.value = false
    notify('Профиль обновлён!', 'success')
  } catch (e) {
    notify(e.message || 'Ошибка обновления', 'error')
  }
}

async function changePassword() {
  const oldPassword = pwForm.value.oldPassword.trim()
  const newPassword = pwForm.value.newPassword.trim()

  if (!oldPassword) {
    notify('Укажите текущий пароль', 'error')
    return
  }
  if (!newPassword) {
    notify('Укажите новый пароль', 'error')
    return
  }
  if (newPassword.length < 4) {
    notify('Новый пароль должен быть не короче 4 символов', 'error')
    return
  }

  try {
    await api.updatePassword(oldPassword, newPassword)
    pwForm.value = { oldPassword: '', newPassword: '' }
    editOpen.value = false
    notify('Пароль обновлён!', 'success')
  } catch (e) {
    notify(e.message || 'Ошибка смены пароля', 'error')
  }
}

async function changeTeamName() {
  const teamName = teamNameEdit.value.trim()

  if (!teamName) {
    notify('Укажите название команды', 'error')
    return
  }
  if (teamName.length < 3) {
    notify('Название команды должно быть не короче 3 символов', 'error')
    return
  }

  try {
    await api.updateTeamName(teamName)
    await loadData()
    editingTeamName.value = false
    notify('Название обновлено!', 'success')
  } catch (e) {
    notify(e.message || 'Ошибка обновления', 'error')
  }
}

function startEditTeamName() {
  teamNameEdit.value = profile.value?.team?.name || ''
  editingTeamName.value = true
}

function onLogout() {
  auth.logout()
  router.push('/')
}

onMounted(async () => {
  await loadData()
  await checkPendingInvite()
})
</script>

<style scoped>
.news-socials {
  margin-top: 16px;
  padding-top: 14px;
  border-top: 1px solid var(--border);
  text-align: center;
}
.news-socials-text {
  font-size: 13px;
  color: var(--text-tertiary);
  margin-bottom: 10px;
}
.news-socials-row {
  display: flex;
  gap: 10px;
  justify-content: center;
}
.news-social-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border-radius: var(--radius-pill);
  font-size: 13px;
  font-weight: 500;
  text-decoration: none;
  border: 1px solid var(--border);
  color: var(--text-secondary);
  background: var(--bg);
  transition: all 0.2s ease;
}
.news-social-btn:hover {
  color: var(--text-primary);
  transform: translateY(-1px);
  box-shadow: var(--shadow);
}
.modal {
  display: flex;
  align-items: center;
  justify-content: center;
}
.modal-content {
  max-height: 85vh;
  overflow-y: auto;
}
.modal-divider {
  margin: 16px 0;
  border: none;
  border-top: 1px solid var(--border);
}
.no-team-section {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.empty-state-text {
  color: var(--secondary);
  text-align: center;
  margin: 0;
}
.team-name-display {
  display: flex;
  align-items: center;
  gap: 6px;
  min-width: 0;
  flex: 1;
  overflow: hidden;
}
.team-name-display h3 {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  min-width: 0;
}
.btn-edit-name {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 14px;
  padding: 2px;
  opacity: 0.4;
  transition: opacity 0.2s;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  color: var(--text-secondary);
}
.btn-edit-name:hover {
  opacity: 1;
}
.team-name-edit {
  flex: 1;
  min-width: 0;
  display: flex;
  align-items: center;
  overflow: hidden;
}
.team-name-form {
  display: flex;
  gap: 4px;
  align-items: center;
  width: 100%;
}
.team-name-input {
  flex: 1;
  padding: 0 8px;
  border: 1px solid var(--border);
  border-radius: 6px;
  background: var(--bg);
  font-size: 15px;
  font-weight: 600;
  color: var(--text);
  font-family: var(--font);
  min-width: 0;
  height: 28px;
  line-height: 28px;
}
.team-name-input:focus {
  outline: none;
  border-color: var(--accent-secondary);
}
.btn-save-name {
  background: var(--accent);
  color: #fff;
  border: none;
  border-radius: 6px;
  width: 28px;
  height: 28px;
  cursor: pointer;
  font-size: 13px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.btn-cancel-sm {
  background: none;
  border: 1px solid var(--border);
  border-radius: 6px;
  width: 28px;
  height: 28px;
  cursor: pointer;
  font-size: 13px;
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.btn-cancel-sm:hover {
  background: var(--bg);
}
.team-action-card {
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 14px;
}
.team-action-card h3 {
  margin: 0 0 8px 0;
  font-size: 1rem;
}
.team-action-card form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.team-action-card .form-group {
  margin: 0;
}
.team-action-card .btn-primary {
  align-self: flex-start;
}
.invite-section {
  margin: 14px 0;
  padding: 12px 0;
  border-top: 1px solid var(--border);
}
.invite-link-row {
  display: flex;
  gap: 8px;
  margin-top: 6px;
}
.invite-input {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--bg);
  font-size: 0.85rem;
  color: var(--text);
  cursor: pointer;
}
.btn-copy {
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  background: #030912;
  color: #fff;
  cursor: pointer;
  font-size: 0.85rem;
  white-space: nowrap;
  transition: background 0.2s, border-color 0.2s;
}
.btn-copy:hover {
  opacity: 0.85;
}
.btn-copy-done {
  background: #4EA0FF;
  border-color: #4EA0FF;
}
.team-members-list {
  margin-top: 14px;
  padding-top: 14px;
  border-top: 1px solid var(--border);
}
.team-members-list h4 {
  margin: 0 0 6px 0;
  font-size: 0.95rem;
}
.team-member-row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 5px 0;
  border-bottom: 1px solid var(--border);
}
.team-member-row:last-child {
  border-bottom: none;
}
.member-name {
  font-weight: 500;
  flex: 1;
}
.member-role-badge {
  font-size: 0.75rem;
  color: var(--text-secondary);
  background: var(--bg);
  padding: 2px 8px;
  border-radius: 6px;
  font-weight: 500;
}
.member-group {
  color: var(--secondary);
  font-size: 0.9rem;
}
.btn-danger-sm {
  margin-top: 12px;
  padding: 6px 14px;
  border: 1px solid #e53935;
  border-radius: 8px;
  background: transparent;
  color: #e53935;
  font-size: 0.8rem;
  cursor: pointer;
  align-self: center;
  transition: background 0.2s;
}
.btn-danger-sm:hover {
  background: rgba(229, 57, 53, 0.08);
}
.btn-danger-outline-sm {
  margin-top: 12px;
  padding: 6px 14px;
  border: 1px solid rgba(229, 57, 53, 0.3);
  border-radius: 8px;
  background: transparent;
  color: #e53935;
  font-size: 0.8rem;
  cursor: pointer;
  align-self: center;
  transition: background 0.2s;
}
.btn-danger-outline-sm:hover {
  background: rgba(229, 57, 53, 0.08);
}
.confirm-popup {
  background: var(--surface);
  border-radius: 16px;
  padding: 24px;
  max-width: 380px;
  width: 90%;
  text-align: center;
  box-shadow: 0 20px 60px rgba(0,0,0,0.15);
}
.confirm-icon {
  font-size: 1.5rem;
  font-weight: 700;
  color: #e53935;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(229, 57, 53, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 12px;
}
.confirm-popup h3 {
  margin: 0 0 8px 0;
  font-size: 1.15rem;
}
.confirm-text {
  color: var(--secondary);
  font-size: 0.9rem;
  margin: 0 0 16px 0;
  line-height: 1.5;
}
.confirm-actions {
  display: flex;
  gap: 10px;
  justify-content: center;
}
.btn-cancel {
  padding: 10px 24px;
  border: 1px solid var(--border);
  border-radius: 10px;
  background: var(--bg);
  color: var(--text);
  font-size: 0.9rem;
  cursor: pointer;
  transition: background 0.2s;
}
.btn-cancel:hover {
  background: var(--border);
}
.btn-confirm-danger {
  padding: 10px 24px;
  border: none;
  border-radius: 10px;
  background: #e53935;
  color: #fff;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background 0.2s;
}
.btn-confirm-danger:hover {
  background: #c62828;
}
</style>
