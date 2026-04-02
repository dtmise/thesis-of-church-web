<template>
  <div class="auth-page">
    <ContactModal />

    <div class="auth-wrapper">
      <!-- Hero -->
      <div class="hero-section">
        <h1 class="hero-title">Church-Turing<br>Thesis</h1>
        <p class="hero-subtitle">Хакатон по математической логике</p>
        <div class="hero-social">
          <a href="https://t.me/+2UInlPHybzhjYzRi" target="_blank" rel="noopener" class="hero-social-link">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.2-.08-.06-.19-.04-.27-.02-.12.03-1.99 1.27-5.62 3.72-.53.36-1.01.54-1.44.53-.47-.01-1.38-.27-2.06-.49-.83-.27-1.49-.42-1.43-.88.03-.24.37-.49 1.02-.74 4-1.73 6.67-2.88 8.02-3.45 3.82-1.6 4.62-1.87 5.13-1.88.11 0 .37.03.53.17.14.12.18.28.2.45-.01.06.01.24 0 .37z" fill="currentColor"/></svg>
            Telegram
          </a>
          <a href="https://vk.com/church_turing_thesis" target="_blank" rel="noopener" class="hero-social-link">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5.01 13.35h-1.3c-.5 0-.65-.4-1.54-1.3-.78-.75-1.12-.85-1.31-.85-.27 0-.35.08-.35.45v1.19c0 .32-.1.51-1 .51-1.47 0-3.1-.89-4.25-2.56-1.73-2.43-2.2-4.26-2.2-4.63 0-.19.08-.36.45-.36h1.3c.34 0 .46.15.59.51.65 1.9 1.74 3.56 2.19 3.56.17 0 .24-.08.24-.51V9.93c-.05-.88-.52-.95-.52-1.26 0-.15.13-.31.33-.31h2.04c.28 0 .38.15.38.49v2.58c0 .28.13.38.21.38.17 0 .31-.1.62-.41.96-1.07 1.64-2.73 1.64-2.73.09-.19.24-.36.58-.36h1.3c.39 0 .48.2.39.49-.17.77-1.81 3.1-1.81 3.1-.14.23-.2.34 0 .6.14.19.62.6.94.97.59.67 1.05 1.23 1.17 1.62.13.38-.07.58-.45.58z" fill="currentColor"/></svg>
            VK
          </a>
        </div>
      </div>

      <!-- Auth container -->
      <div class="auth-container">
        <div class="tabs">
          <button :class="['tab-btn', { active: tab === 'register' }]" @click="tab = 'register'">Регистрация</button>
          <button :class="['tab-btn', { active: tab === 'login' }]" @click="tab = 'login'">Вход</button>
        </div>

        <!-- Register form -->
        <form v-if="tab === 'register'" class="auth-form active" @submit.prevent="onRegister">
          <div class="form-section">
            <h2>Создать аккаунт</h2>
            <div class="form-group">
              <label>ФИО</label>
              <input v-model="regForm.fullName" type="text" placeholder="Иванов Иван Иванович" required>
            </div>
            <div class="form-group">
              <label>Группа</label>
              <input v-model="regForm.group" type="text" placeholder="23212" required>
            </div>
            <div class="form-group">
              <label>Email</label>
              <input v-model="regForm.email" type="email" placeholder="example@mail.com" required>
            </div>
            <div class="form-group">
              <label>Пароль</label>
              <input v-model="regForm.password" type="password" placeholder="минимум 6 символов" required minlength="6">
            </div>
            <div class="input-hint">После регистрации вы сможете создать команду или присоединиться по приглашению</div>
          </div>

          <button type="submit" class="btn-submit" :disabled="loading">
            {{ loading ? 'Регистрация...' : 'Зарегистрироваться' }}
          </button>
        </form>

        <!-- Login form -->
        <form v-if="tab === 'login'" class="auth-form active" @submit.prevent="onLogin">
          <div class="form-section">
            <h2>Вход в аккаунт</h2>
            <div class="form-group">
              <label>Email</label>
              <input v-model="loginEmail" type="email" placeholder="example@mail.com" required>
            </div>
            <div class="form-group">
              <label>Пароль</label>
              <input v-model="loginPassword" type="password" placeholder="••••••" required>
            </div>
            <button type="button" class="forgot-password-link" @click="forgotPasswordOpen = true">
              Забыли пароль?
            </button>
          </div>
          <button type="submit" class="btn-submit" :disabled="loading">
            {{ loading ? 'Вход...' : 'Войти' }}
          </button>
        </form>
      </div>

      <div v-if="forgotPasswordOpen" class="modal" @click.self="forgotPasswordOpen = false">
        <div class="modal-content forgot-password-modal">
          <span class="close" @click="forgotPasswordOpen = false">&times;</span>
          <h3>Забыли пароль?</h3>
          <p class="forgot-password-text">Эххх... Это печально. В таком случае скорее пиши в tg:</p>
          <a href="https://t.me/Q1zin" target="_blank" rel="noopener" class="forgot-password-contact">@Q1zin</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { auth } from '../composables/auth'
import { useNotification } from '../composables/notification'
import ContactModal from '../components/ContactModal.vue'

const router = useRouter()
const route = useRoute()
const { show: notify } = useNotification()

onMounted(() => {
  // Save invite code from URL if present
  const invite = route.query.invite
  if (invite) {
    sessionStorage.setItem('pendingInvite', invite)
  }
  if (auth.isAuthenticated) router.replace('/dashboard')
})

const tab = ref('register')
const loading = ref(false)
const forgotPasswordOpen = ref(false)

// Login
const loginEmail = ref('')
const loginPassword = ref('')

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

function isValidGroup(value) {
  return /^\d{5}$/.test(value)
}

async function onLogin() {
  const email = loginEmail.value.trim()
  const password = loginPassword.value.trim()

  if (!email) {
    notify('Укажите email', 'error')
    return
  }
  if (!isValidEmail(email)) {
    notify('Укажите корректный email', 'error')
    return
  }
  if (!password) {
    notify('Укажите пароль', 'error')
    return
  }

  loading.value = true
  try {
    await auth.login(email, password)
    router.push('/dashboard')
  } catch (e) {
    notify(e.message || 'Ошибка входа', 'error')
  } finally {
    loading.value = false
  }
}

// Register
const regForm = ref({ fullName: '', group: '', email: '', password: '' })

async function onRegister() {
  const f = regForm.value
  const fullName = f.fullName.trim()
  const group = f.group.trim()
  const email = f.email.trim()
  const password = f.password.trim()

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
  if (!password || password.length < 6) {
    notify('Пароль минимум 6 символов', 'error')
    return
  }

  loading.value = true
  try {
    await auth.register(fullName, group, email, password)
    router.push('/dashboard')
  } catch (e) {
    notify(e.message || 'Ошибка регистрации', 'error')
  } finally {
    loading.value = false
  }
}
</script>
