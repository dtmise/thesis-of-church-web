<template>
  <div v-if="show" class="contact-overlay" @click.self="close">
    <div class="contact-modal">
      <button class="contact-close" @click="close" aria-label="Закрыть">&times;</button>
      <div class="contact-modal-header">
        <h2>Добро пожаловать!</h2>
        <p>Оставьте свой контакт, чтобы мы могли держать вас в курсе</p>
      </div>
      <form class="contact-form" @submit.prevent="submit">
        <div class="form-group">
          <label>Telegram</label>
          <input v-model="form.telegram" type="text" placeholder="@username">
        </div>
        <div class="form-group">
          <label>VK</label>
          <input v-model="form.vk" type="text" placeholder="vk.com/id или @username">
        </div>
        <div class="input-hint" style="margin-bottom: 12px; text-align: center;">Заполните хотя бы одно поле</div>
        <button type="submit" class="btn-submit">Продолжить</button>
      </form>
      <div class="contact-modal-footer">
        <p>Присоединяйтесь к нам</p>
        <div class="social-row">
          <a href="https://t.me/+2UInlPHybzhjYzRi" target="_blank" rel="noopener" class="social-btn social-tg">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.2-.08-.06-.19-.04-.27-.02-.12.03-1.99 1.27-5.62 3.72-.53.36-1.01.54-1.44.53-.47-.01-1.38-.27-2.06-.49-.83-.27-1.49-.42-1.43-.88.03-.24.37-.49 1.02-.74 4-1.73 6.67-2.88 8.02-3.45 3.82-1.6 4.62-1.87 5.13-1.88.11 0 .37.03.53.17.14.12.18.28.2.45-.01.06.01.24 0 .37z" fill="currentColor"/></svg>
            Telegram
          </a>
          <a href="https://vk.com/church_turing_thesis" target="_blank" rel="noopener" class="social-btn social-vk">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5.01 13.35h-1.3c-.5 0-.65-.4-1.54-1.3-.78-.75-1.12-.85-1.31-.85-.27 0-.35.08-.35.45v1.19c0 .32-.1.51-1 .51-1.47 0-3.1-.89-4.25-2.56-1.73-2.43-2.2-4.26-2.2-4.63 0-.19.08-.36.45-.36h1.3c.34 0 .46.15.59.51.65 1.9 1.74 3.56 2.19 3.56.17 0 .24-.08.24-.51V9.93c-.05-.88-.52-.95-.52-1.26 0-.15.13-.31.33-.31h2.04c.28 0 .38.15.38.49v2.58c0 .28.13.38.21.38.17 0 .31-.1.62-.41.96-1.07 1.64-2.73 1.64-2.73.09-.19.24-.36.58-.36h1.3c.39 0 .48.2.39.49-.17.77-1.81 3.1-1.81 3.1-.14.23-.2.34 0 .6.14.19.62.6.94.97.59.67 1.05 1.23 1.17 1.62.13.38-.07.58-.45.58z" fill="currentColor"/></svg>
            VK
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { api } from '../composables/api'
import { useNotification } from '../composables/notification'

const show = ref(false)
const form = ref({ telegram: '', vk: '' })
const { show: notify } = useNotification()

onMounted(() => {
  if (!localStorage.getItem('contactSubmitted') && !localStorage.getItem('hasLoggedIn')) {
    show.value = true
  }
})

function close() {
  show.value = false
}

async function submit() {
  const telegram = form.value.telegram.trim()
  const vk = form.value.vk.trim()

  if (!telegram && !vk) {
    notify('Заполните хотя бы одно поле: Telegram или VK', 'error')
    return
  }
  try {
    await api.submitContact({ telegram, vk })
    localStorage.setItem('contactSubmitted', '1')
    show.value = false
  } catch (e) {
    notify(e.message || 'Ошибка отправки', 'error')
  }
}
</script>

<style scoped>
.contact-overlay {
  position: fixed;
  inset: 0;
  z-index: 2000;
  background: rgba(0,0,0,0.35);
  backdrop-filter: blur(16px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}
.contact-modal {
  background: var(--surface);
  border-radius: var(--radius-lg);
  box-shadow: 0 24px 64px rgba(0,0,0,0.15);
  width: 100%;
  max-width: 440px;
  overflow: hidden;
  animation: modalIn 0.35s ease;
}
@keyframes modalIn { from { opacity:0; transform: scale(0.96) translateY(8px); } to { opacity:1; transform: scale(1) translateY(0); } }
.contact-modal { position: relative; }
.contact-close { position: absolute; top: 10px; right: 14px; background: none; border: none; font-size: 24px; color: var(--text-tertiary); cursor: pointer; padding: 4px 8px; line-height: 1; border-radius: 6px; transition: background 0.15s; }
.contact-close:hover { background: var(--bg-hover, rgba(0,0,0,0.06)); color: var(--text-primary); }
.contact-modal-header { padding: 24px 32px 12px; text-align: center; }
.contact-modal-header h2 { font-size: 22px; font-weight: 700; letter-spacing: -0.4px; margin-bottom: 4px; }
.contact-modal-header p { font-size: 14px; color: var(--text-secondary); line-height: 1.4; }
.contact-form { padding: 4px 32px 16px; }
.contact-modal-footer { padding: 0 32px 24px; text-align: center; }
.contact-modal-footer > p { font-size: 12px; color: var(--text-tertiary); margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 500; }
.social-row { display: flex; gap: 10px; justify-content: center; }
.social-btn { display: inline-flex; align-items: center; gap: 8px; padding: 8px 18px; border-radius: var(--radius-pill); font-size: 13px; font-weight: 500; text-decoration: none; border: 1px solid var(--border); color: var(--text-primary); background: var(--bg); transition: all 0.2s ease; }
.social-btn:hover { transform: translateY(-1px); box-shadow: var(--shadow); }
.social-btn.social-tg:hover { background: #e8f4fd; border-color: #b3daf5; color: #0088cc; }
.social-btn.social-vk:hover { background: #e8eef8; border-color: #b3c5e6; color: #4a76a8; }
</style>
