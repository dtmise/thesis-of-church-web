<template>
  <Transition name="notif">
    <div v-if="visible" :class="['notification', type]">{{ message }}</div>
  </Transition>
</template>

<script setup>
import { useNotification } from '../composables/notification'
const { message, type, visible } = useNotification()
</script>

<style scoped>
.notification {
  position: fixed;
  top: 16px;
  right: 16px;
  padding: 12px 20px;
  border-radius: 14px;
  color: #fff;
  font-size: 14px;
  font-weight: 500;
  z-index: 10000;
  max-width: 360px;
  word-wrap: break-word;
  box-shadow: 0 8px 24px rgba(0,0,0,0.08);
}
.info { background: #007AFF; }
.success { background: #34C759; }
.error { background: #FF3B30; }
.warning { background: #FF9500; }

.notif-enter-active { animation: slideIn 0.3s ease; }
.notif-leave-active { animation: slideOut 0.3s ease; }
@keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
@keyframes slideOut { from { transform: translateX(0); opacity: 1; } to { transform: translateX(100%); opacity: 0; } }
</style>
