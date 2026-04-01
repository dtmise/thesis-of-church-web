<template>
  <div class="admin-layout">
    <!-- Sidebar -->
    <aside class="admin-sidebar">
      <div class="sidebar-header">
        <h1 class="sidebar-title">Админ-панель</h1>
      </div>
      <nav class="sidebar-nav">
        <button :class="['nav-item', { active: tab === 'news' }]" @click="tab = 'news'">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"/><path d="M18 14h-8"/><path d="M15 18h-5"/><path d="M10 6h8v4h-8V6Z"/></svg>
          Новости
        </button>
        <button :class="['nav-item', { active: tab === 'users' }]" @click="tab = 'users'">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          Пользователи
        </button>
        <button :class="['nav-item', { active: tab === 'teams' }]" @click="tab = 'teams'">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
          Команды
        </button>
        <button :class="['nav-item', { active: tab === 'contacts' }]" @click="tab = 'contacts'">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
          Контакты
        </button>
      </nav>
      <div class="sidebar-footer">
        <router-link to="/dashboard" class="nav-item nav-back">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m15 18-6-6 6-6"/></svg>
          Назад
        </router-link>
        <button class="nav-item nav-logout" @click="onLogout">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          Выйти
        </button>
      </div>
    </aside>

    <!-- Content -->
    <div class="admin-content">
      <!-- News -->
      <div v-if="tab === 'news'" class="content-section">
        <div class="content-header">
          <h2>Новости</h2>
          <button class="btn-add" @click="openCreateNews">+ Добавить</button>
        </div>
        <div class="content-divider"></div>
        <div v-if="news.length" class="content-list">
          <div v-for="(item, i) in news" :key="item.id" class="content-row">
            <div class="row-main">
              <span class="row-title">{{ item.title }}</span>
              <span class="row-caption">{{ item.content }}</span>
            </div>
            <div class="row-right">
              <span class="row-date">{{ formatDate(item.publishedAt) }}</span>
              <div class="row-actions">
                <button class="btn-row-action" @click="openEditNews(item)">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>
                </button>
                <button class="btn-row-action btn-row-delete" @click="confirmDeleteNews(item)">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                </button>
              </div>
            </div>
            <div v-if="i < news.length - 1" class="row-separator"></div>
          </div>
        </div>
        <div v-else class="content-empty">Новостей пока нет</div>
      </div>

      <!-- Users -->
      <div v-if="tab === 'users'" class="content-section">
        <div class="content-header">
          <h2>Пользователи</h2>
          <span class="header-count">{{ users.length }}</span>
        </div>
        <div class="content-divider"></div>
        <div v-if="users.length" class="content-list">
          <div v-for="(u, i) in users" :key="u.id" class="content-row">
            <div class="row-main">
              <span class="row-title">{{ u.fullName }}</span>
              <span class="row-caption">{{ u.group }} · {{ u.email }}</span>
            </div>
            <div class="row-right">
              <button
                v-if="u.id !== auth.user.id"
                class="badge btn-admin-toggle"
                :class="u.isAdmin ? 'btn-admin-revoke' : 'btn-admin-promote'"
                @click="toggleAdmin(u)"
              >{{ u.isAdmin ? 'Разжаловать' : 'Сделать админом' }}</button>
              <span v-if="u.isAdmin" class="badge badge-admin">admin</span>
              <span v-if="u.role" class="badge badge-role">{{ u.role }}</span>
              <span v-if="!u.teamId" class="badge badge-noteam">без команды</span>
            </div>
            <div v-if="i < users.length - 1" class="row-separator"></div>
          </div>
        </div>
        <div v-else class="content-empty">Нет пользователей</div>
      </div>

      <!-- Teams -->
      <div v-if="tab === 'teams'" class="content-section">
        <div class="content-header">
          <h2>Команды</h2>
          <span class="header-count">{{ teams.length }}</span>
        </div>
        <div class="content-divider"></div>
        <div v-if="teams.length" class="content-list">
          <div v-for="(t, i) in teams" :key="t.id" class="team-block">
            <div class="content-row team-row-header">
              <div class="row-main">
                <span class="row-title">{{ t.name }}</span>
                <span class="row-caption">{{ t.members.length }} участник{{ t.members.length === 1 ? '' : t.members.length < 5 ? 'а' : 'ов' }} · {{ t.score }} очков</span>
              </div>
            </div>
            <div v-if="t.members.length" class="team-members-list">
              <div v-for="m in t.members" :key="m.id" class="member-item">
                <span class="member-name">{{ m.fullName }}</span>
                <span class="member-meta">{{ m.group }}</span>
                <span class="member-meta">{{ m.email }}</span>
                <span v-if="m.role === 'captain'" class="badge badge-captain">Капитан</span>
              </div>
            </div>
            <div v-if="i < teams.length - 1" class="row-separator"></div>
          </div>
        </div>
        <div v-else class="content-empty">Нет команд</div>
      </div>

      <!-- Contacts -->
      <div v-if="tab === 'contacts'" class="content-section">
        <div class="content-header">
          <h2>Контакты</h2>
          <span class="header-count">{{ contacts.length }}</span>
        </div>
        <div class="content-divider"></div>
        <div v-if="contacts.length" class="contacts-table-wrap">
          <table class="contacts-table">
            <thead>
              <tr>
                <th>Telegram</th>
                <th>VK</th>
                <th>Дата</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="c in contacts" :key="c.id">
                <td>
                  <a v-if="c.telegram" :href="tgLink(c.telegram)" target="_blank" rel="noopener" class="contact-link contact-link-tg">{{ c.telegram }}</a>
                  <span v-else class="contact-empty">—</span>
                </td>
                <td>
                  <a v-if="c.vk" :href="vkLink(c.vk)" target="_blank" rel="noopener" class="contact-link contact-link-vk">{{ c.vk }}</a>
                  <span v-else class="contact-empty">—</span>
                </td>
                <td class="contact-date">{{ formatDate(c.createdAt) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-else class="content-empty">Нет контактов</div>
      </div>
    </div>

    <!-- News modal -->
    <div v-if="newsModal" class="modal" @click.self="newsModal = false">
      <div class="modal-content">
        <span class="close" @click="newsModal = false">&times;</span>
        <h3>{{ editingNews ? 'Редактировать новость' : 'Новая новость' }}</h3>
        <form @submit.prevent="saveNews">
          <div class="form-group">
            <label>Заголовок</label>
            <input v-model="newsForm.title" type="text" required>
          </div>
          <div class="form-group">
            <label>Содержание</label>
            <textarea v-model="newsForm.content" required rows="5"></textarea>
          </div>
          <button type="submit" class="btn-submit">{{ editingNews ? 'Сохранить' : 'Опубликовать' }}</button>
        </form>
      </div>
    </div>

    <!-- Delete confirm -->
    <div v-if="deleteTarget" class="modal" @click.self="deleteTarget = null">
      <div class="confirm-popup">
        <div class="confirm-icon">!</div>
        <h3>Удалить новость?</h3>
        <p class="confirm-text">«{{ deleteTarget.title }}» будет удалена. Это действие необратимо.</p>
        <div class="confirm-actions">
          <button class="btn-cancel" @click="deleteTarget = null">Отмена</button>
          <button class="btn-confirm-danger" @click="doDeleteNews">Удалить</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { auth } from '../composables/auth'
import { api } from '../composables/api'

const router = useRouter()
const tab = ref('news')
const users = ref([])
const teams = ref([])
const news = ref([])
const contacts = ref([])

const newsModal = ref(false)
const editingNews = ref(null)
const newsForm = ref({ title: '', content: '' })
const deleteTarget = ref(null)

onMounted(async () => {
  if (!auth.user?.isAdmin) {
    router.replace('/dashboard')
    return
  }
  await loadAll()
})

async function loadAll() {
  const [u, t, n, c] = await Promise.all([
    api.adminGetUsers(),
    api.adminGetTeams(),
    api.adminGetNews(),
    api.adminGetContacts()
  ])
  users.value = u
  teams.value = t
  news.value = n
  contacts.value = c
}

function formatDate(d) {
  return new Date(d).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' })
}

function tgLink(val) {
  if (!val) return '#'
  val = val.trim()
  if (/^https?:\/\//i.test(val)) return val
  if (val.startsWith('@')) return `https://t.me/${val.slice(1)}`
  if (val.startsWith('t.me/')) return `https://${val}`
  return `https://t.me/${val}`
}

function vkLink(val) {
  if (!val) return '#'
  val = val.trim()
  if (/^https?:\/\//i.test(val)) return val
  if (val.startsWith('@')) return `https://vk.com/${val.slice(1)}`
  if (val.startsWith('vk.com/')) return `https://${val}`
  return `https://vk.com/${val}`
}

function openCreateNews() {
  editingNews.value = null
  newsForm.value = { title: '', content: '' }
  newsModal.value = true
}

function openEditNews(item) {
  editingNews.value = item
  newsForm.value = { title: item.title, content: item.content }
  newsModal.value = true
}

async function saveNews() {
  const { title, content } = newsForm.value
  if (editingNews.value) {
    await api.adminUpdateNews(editingNews.value.id, title, content)
  } else {
    await api.adminCreateNews(title, content)
  }
  newsModal.value = false
  news.value = await api.adminGetNews()
}

function confirmDeleteNews(item) {
  deleteTarget.value = item
}

async function doDeleteNews() {
  await api.adminDeleteNews(deleteTarget.value.id)
  deleteTarget.value = null
  news.value = await api.adminGetNews()
}

function onLogout() {
  auth.logout()
  router.push('/')
}

async function toggleAdmin(user) {
  const newStatus = !user.isAdmin
  await api.adminSetAdmin(user.id, newStatus)
  user.isAdmin = newStatus
}
</script>

<style scoped>
/* Layout */
.admin-layout {
  display: flex;
  height: 100vh;
  background: #fff;
}

/* Sidebar */
.admin-sidebar {
  width: 220px;
  min-width: 220px;
  background: #fff;
  border-right: 1px solid #E5E5E5;
  display: flex;
  flex-direction: column;
  padding: 20px 12px;
}
.sidebar-header {
  padding: 0 8px 20px;
}
.sidebar-title {
  font-size: 17px;
  font-weight: 700;
  color: #000;
  letter-spacing: -0.3px;
}
.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
}
.nav-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border: none;
  background: transparent;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 400;
  color: #666;
  cursor: pointer;
  transition: all 0.15s;
  text-decoration: none;
  width: 100%;
  text-align: left;
}
.nav-item:hover {
  background: #F5F5F5;
  color: #333;
}
.nav-item.active {
  background: #F0F0F0;
  color: #000;
  font-weight: 600;
}
.nav-item svg {
  flex-shrink: 0;
  opacity: 0.5;
}
.nav-item.active svg {
  opacity: 0.8;
}
.sidebar-footer {
  margin-top: auto;
  padding-top: 12px;
  border-top: 1px solid #E5E5E5;
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.nav-back {
  color: #666;
}
.nav-logout {
  color: #999;
}
.nav-logout:hover {
  color: #e53935;
  background: #FFF5F5;
}

/* Content */
.admin-content {
  flex: 1;
  padding: 32px;
  overflow-y: auto;
  min-width: 0;
}
.content-section {
  animation: fadeIn 0.2s ease;
}
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

.content-header {
  display: flex;
  align-items: center;
  gap: 10px;
}
.content-header h2 {
  font-size: 17px;
  font-weight: 600;
  color: #000;
  letter-spacing: -0.3px;
}
.header-count {
  font-size: 13px;
  color: #8E8E93;
  font-weight: 500;
  background: #F0F0F0;
  padding: 2px 8px;
  border-radius: 10px;
}
.content-divider {
  height: 1px;
  background: #E5E5E5;
  margin: 12px 0 0;
}

/* Rows */
.content-list {
  display: flex;
  flex-direction: column;
}
.content-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 0;
  gap: 16px;
  position: relative;
}
.row-separator {
  height: 1px;
  background: #F0F0F0;
}
.row-main {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
  flex: 1;
}
.row-title {
  font-size: 15px;
  font-weight: 400;
  color: #000;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.row-caption {
  font-size: 13px;
  color: #8E8E93;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.row-right {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}
.row-date {
  font-size: 13px;
  color: #8E8E93;
}
.row-actions {
  display: flex;
  gap: 4px;
}
.btn-row-action {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border: none;
  background: transparent;
  border-radius: 6px;
  color: #999;
  cursor: pointer;
  transition: all 0.15s;
}
.btn-row-action:hover {
  background: #F0F0F0;
  color: #333;
}
.btn-row-delete:hover {
  background: #FFF5F5;
  color: #e53935;
}

/* Badges */
.badge {
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 10px;
  font-weight: 500;
  white-space: nowrap;
}
.badge-admin {
  background: #E8F4FD;
  color: #0088CC;
  font-weight: 600;
}
.badge-role {
  background: #F0F0F0;
  color: #666;
}
.badge-noteam {
  background: #FFF8E1;
  color: #F9A825;
}
.badge-captain {
  background: #1C1C1E;
  color: #fff;
}

/* Add button */
.btn-add {
  margin-left: auto;
  padding: 6px 14px;
  border: 1px solid #E5E5E5;
  background: #fff;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  color: #333;
  transition: all 0.15s;
}
.btn-add:hover {
  background: #F5F5F5;
  border-color: #CCC;
}

/* Admin toggle */
.btn-admin-toggle {
  border: none;
  cursor: pointer;
  transition: all 0.15s;
}
.btn-admin-promote {
  background: #E8F4FD;
  color: #0088CC;
}
.btn-admin-promote:hover {
  background: #D0EAFB;
}
.btn-admin-revoke {
  background: #FFF0F0;
  color: #e53935;
}
.btn-admin-revoke:hover {
  background: #FFE0E0;
}

/* Teams */
.team-block {
  position: relative;
}
.team-row-header {
  padding-bottom: 8px;
}
.team-members-list {
  padding: 0 0 14px 16px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.member-item {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 13px;
  flex-wrap: wrap;
}
.member-name {
  font-weight: 500;
  color: #333;
}
.member-meta {
  color: #8E8E93;
  font-size: 12px;
}

/* Content empty */
.content-empty {
  padding: 32px 0;
  text-align: center;
  font-size: 14px;
  color: #8E8E93;
}

/* Contacts table */
.contacts-table-wrap {
  margin-top: 4px;
  overflow-x: auto;
}
.contacts-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}
.contacts-table th {
  text-align: left;
  font-size: 12px;
  font-weight: 600;
  color: #8E8E93;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding: 10px 12px;
  border-bottom: 1px solid #E5E5E5;
}
.contacts-table td {
  padding: 10px 12px;
  border-bottom: 1px solid #F0F0F0;
  vertical-align: middle;
}
.contacts-table tbody tr:last-child td {
  border-bottom: none;
}
.contact-link {
  color: #0088CC;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.15s;
}
.contact-link:hover {
  color: #006AA3;
  text-decoration: underline;
}
.contact-link-vk {
  color: #4680C2;
}
.contact-link-vk:hover {
  color: #3A6DA8;
}
.contact-empty {
  color: #CCC;
}
.contact-date {
  color: #8E8E93;
  font-size: 13px;
  white-space: nowrap;
}

/* Textarea */
textarea {
  width: 100%;
  padding: 10px 14px;
  background: #fff;
  border: 1px solid #E5E5E5;
  border-radius: 8px;
  font-size: 14px;
  color: #000;
  resize: vertical;
  font-family: inherit;
  transition: border-color 0.2s;
}
textarea:focus {
  outline: none;
  border-color: #999;
}

/* Confirm popup */
.confirm-popup {
  background: #fff;
  border-radius: 14px;
  padding: 28px 24px 24px;
  max-width: 340px;
  width: 90%;
  text-align: center;
  box-shadow: 0 20px 60px rgba(0,0,0,0.15);
  animation: fadeIn 0.2s ease;
}
.confirm-icon {
  font-size: 18px;
  font-weight: 700;
  color: #e53935;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #FFF0F0;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 14px;
}
.confirm-popup h3 {
  margin: 0 0 6px;
  font-size: 16px;
  font-weight: 600;
  color: #000;
  letter-spacing: -0.2px;
}
.confirm-text {
  color: #8E8E93;
  font-size: 13px;
  margin: 0 0 20px;
  line-height: 1.5;
}
.confirm-actions {
  display: flex;
  gap: 8px;
}
.btn-cancel {
  flex: 1;
  padding: 9px 16px;
  border: 1px solid #E5E5E5;
  border-radius: 8px;
  background: #fff;
  color: #333;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s;
}
.btn-cancel:hover {
  background: #F5F5F5;
  border-color: #CCC;
}
.btn-confirm-danger {
  flex: 1;
  padding: 9px 16px;
  border: none;
  border-radius: 8px;
  background: #e53935;
  color: #fff;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s;
}
.btn-confirm-danger:hover {
  background: #c62828;
}

/* Mobile */
@media (max-width: 640px) {
  .admin-layout {
    flex-direction: column;
    height: auto;
    min-height: 100vh;
  }
  .admin-sidebar {
    width: 100%;
    min-width: 0;
    border-right: none;
    border-bottom: 1px solid #E5E5E5;
    padding: 16px;
    flex-direction: row;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
  }
  .sidebar-header {
    padding: 0 4px 0 0;
  }
  .sidebar-nav {
    flex-direction: row;
    gap: 4px;
    flex: initial;
  }
  .nav-item {
    padding: 8px 12px;
    font-size: 13px;
  }
  .nav-item svg {
    display: none;
  }
  .sidebar-footer {
    margin-top: 0;
    padding-top: 0;
    border-top: none;
    flex-direction: row;
    margin-left: auto;
  }
  .admin-content {
    padding: 20px;
  }
}
</style>
