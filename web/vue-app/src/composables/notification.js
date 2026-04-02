import { ref } from 'vue'

const message = ref('')
const type = ref('info')
const visible = ref(false)
let timer = null

export function useNotification() {
  function show(msg, t = 'info') {
    message.value = msg
    type.value = t
    visible.value = true
    clearTimeout(timer)
    timer = setTimeout(() => { visible.value = false }, 3000)
  }

  return { message, type, visible, show }
}
