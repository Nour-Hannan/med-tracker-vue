<template>
  <div class="chat-card">
    <h3>Nachricht an Arzt</h3>

    <div class="message-history" v-if="messages.length > 0">
      <div v-for="msg in messages" :key="msg.id" class="message-bubble">
        <p>{{ msg.content }}</p>
        <span class="msg-time">{{ formatTime(msg.timestamp) }}</span>
      </div>
    </div>
    <p v-else class="no-messages">Noch keine Nachrichten.</p>

    <textarea v-model="newMessage" placeholder="Ihre Frage ..." rows="3" />
    <button @click="send" :disabled="!newMessage.trim()" class="chat-send">
      Senden
    </button>
    <p v-if="success" class="success-msg">✓ Nachricht gesendet</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const props = defineProps({
  patientName: String,
  apiUrl: String
})

const newMessage = ref('')
const messages = ref([])
const success = ref(false)

async function loadMessages() {
  try {
    const res = await fetch(`${props.apiUrl}/api/messages`)
    const all = await res.json()
    // Nur Nachrichten dieses Patienten anzeigen
    messages.value = all.filter(m => m.patientName === props.patientName)
  } catch (e) {
    console.error('Nachrichten konnten nicht geladen werden', e)
  }
}

async function send() {
  if (!newMessage.value.trim()) return
  try {
    await fetch(`${props.apiUrl}/api/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        patientName: props.patientName,
        content: newMessage.value
      })
    })
    newMessage.value = ''
    success.value = true
    setTimeout(() => success.value = false, 3000)
    await loadMessages()
  } catch (e) {
    console.error('Senden fehlgeschlagen', e)
  }
}

function formatTime(ts) {
  if (!ts) return ''
  return new Date(ts).toLocaleString('de-DE', { dateStyle: 'short', timeStyle: 'short' })
}

onMounted(loadMessages)
</script>

<style scoped>
.chat-card { background: white; border-radius: 20px; padding: 20px; margin-bottom: 32px; }
.chat-card h3 { margin-bottom: 12px; }
.message-history { display: flex; flex-direction: column; gap: 8px; margin-bottom: 16px; }
.message-bubble {
  background: #e8f4f8;
  border-radius: 12px;
  padding: 10px 14px;
}
.msg-time { font-size: 11px; color: #8a9baa; display: block; margin-top: 4px; }
.no-messages { color: #8a9baa; font-size: 13px; margin-bottom: 12px; }
textarea {
  width: 100%;
  padding: 12px;
  border-radius: 16px;
  border: 1px solid #cddfe7;
  margin: 8px 0;
  font-family: inherit;
  resize: vertical;
}
.chat-send {
  background: #1a5f7a;
  color: white;
  border: none;
  padding: 8px 20px;
  border-radius: 30px;
  cursor: pointer;
}
.chat-send:disabled { background: #aaa; cursor: not-allowed; }
.success-msg { color: #42b883; font-size: 13px; margin-top: 8px; }
</style>