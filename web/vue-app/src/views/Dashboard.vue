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
          <div class="block-icon">👤</div>
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
          <div class="block-icon">👥</div>
          <h2>Моя команда</h2>
          <div class="team-details">
            <h3>{{ profile.team.name }}</h3>
            <div class="team-stats">
              <p><strong>Участников:</strong> {{ profile.team.members?.length || 0 }} / 3</p>
            </div>
            <span class="team-badge">{{ profile.role === 'captain' ? 'Вы капитан' : 'Вы участник' }}</span>

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
                <span class="member-role-badge">{{ m.role === 'captain' ? '👑' : '👤' }}</span>
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
          <div class="block-icon">👥</div>
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
            <p v-if="teamError" class="error-message visible">{{ teamError }}</p>
          </div>
        </div>

        <!-- News -->
        <div class="info-block news-block">
          <div class="block-icon">📰</div>
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
            <p>📭 Новостей пока нет</p>
          </div>
          <div v-else class="loading-spinner">Загрузка...</div>
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

        <template v-if="profile?.role === 'captain'">
          <hr class="modal-divider">
          <h3>Название команды</h3>
          <form @submit.prevent="changeTeamName">
            <div class="form-group">
              <label>Новое название</label>
              <input v-model="teamNameEdit" type="text" required>
            </div>
            <button type="submit" class="btn-primary">Сохранить</button>
          </form>
        </template>
      </div>
    </div>

    <!-- Confirm popup -->
    <div v-if="confirmAction" class="modal" style="display:flex;" @click.self="confirmAction = null">
      <div class="confirm-popup">
        <div class="confirm-icon">⚠️</div>
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
const teamError = ref('')
const newTeamName = ref('')
const joinCode = ref('')
const copied = ref(false)
const confirmAction = ref(null)

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
  teamError.value = ''
  teamLoading.value = true
  try {
    await api.createTeam(newTeamName.value)
    newTeamName.value = ''
    notify('Команда создана!', 'success')
    await loadData()
  } catch (e) {
    teamError.value = e.message
  } finally {
    teamLoading.value = false
  }
}

async function onJoinTeam() {
  teamError.value = ''
  teamLoading.value = true
  try {
    await api.joinTeam(joinCode.value)
    joinCode.value = ''
    notify('Вы присоединились к команде!', 'success')
    await loadData()
  } catch (e) {
    teamError.value = e.message
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
  try {
    await api.updateProfile({ fullName: editForm.value.fullName, group: editForm.value.group })
    await api.updateEmail(editForm.value.email)
    await loadData()
    editOpen.value = false
    notify('Профиль обновлён!', 'success')
  } catch (e) {
    notify(e.message || 'Ошибка обновления', 'error')
  }
}

async function changePassword() {
  try {
    await api.updatePassword(pwForm.value.oldPassword, pwForm.value.newPassword)
    pwForm.value = { oldPassword: '', newPassword: '' }
    editOpen.value = false
    notify('Пароль обновлён!', 'success')
  } catch (e) {
    notify(e.message || 'Ошибка смены пароля', 'error')
  }
}

async function changeTeamName() {
  try {
    await api.updateTeamName(teamNameEdit.value)
    await loadData()
    editOpen.value = false
    notify('Название обновлено!', 'success')
  } catch (e) {
    notify(e.message || 'Ошибка обновления', 'error')
  }
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
  margin: 24px 0;
  border: none;
  border-top: 1px solid var(--border);
}
.no-team-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.empty-state-text {
  color: var(--secondary);
  text-align: center;
  margin: 0;
}
.team-action-card {
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 20px;
}
.team-action-card h3 {
  margin: 0 0 12px 0;
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
  margin-top: 16px;
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
  margin-top: 20px;
}
.team-members-list h4 {
  margin: 0 0 10px 0;
  font-size: 0.95rem;
}
.team-member-row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 0;
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
  font-size: 1rem;
}
.member-group {
  color: var(--secondary);
  font-size: 0.9rem;
}
.btn-danger-sm {
  margin-top: 20px;
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
  margin-top: 20px;
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
  padding: 32px;
  max-width: 380px;
  width: 90%;
  text-align: center;
  box-shadow: 0 20px 60px rgba(0,0,0,0.15);
}
.confirm-icon {
  font-size: 2.5rem;
  margin-bottom: 12px;
}
.confirm-popup h3 {
  margin: 0 0 8px 0;
  font-size: 1.15rem;
}
.confirm-text {
  color: var(--secondary);
  font-size: 0.9rem;
  margin: 0 0 24px 0;
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
