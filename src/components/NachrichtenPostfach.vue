<template>
  <div>
    <h1>Nachrichten</h1>
    <p v-if="messages.length === 0" class="empty">Keine Nachrichten vorhanden.</p>
    <div v-for="msg in messages" :key="msg.id" :class="['message-card', { unread: !msg.gelesen }]">
      <div class="msg-header">
        <strong>{{ msg.patientName }}</strong>
        <span class="msg-time">{{ formatTime(msg.timestamp) }}</span>
      </div>
      <p class="msg-content">{{ msg.content }}</p>
      <button v-if="!msg.gelesen" @click="markRead(msg.id)" class="btn-read">
        Als gelesen markieren
      </button>
      <span v-else class="read-label">✓ Gelesen</span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const props = defineProps({ apiUrl: String })

const messages = ref([])

async function loadMessages() {
  try {
    const res = await fetch(`${props.apiUrl}/api/messages`)
    messages.value = await res.json()
  } catch (e) {
    console.error('Nachrichten konnten nicht geladen werden', e)
  }
}

async function markRead(id) {
  await fetch(`${props.apiUrl}/api/messages/${id}/gelesen`, { method: 'PUT' })
  await loadMessages()
}

function formatTime(ts) {
  if (!ts) return ''
  return new Date(ts).toLocaleString('de-DE', { dateStyle: 'short', timeStyle: 'short' })
}

onMounted(loadMessages)
</script>

<style scoped>
h1 { margin-bottom: 24px; }
.empty { color: #8a9baa; }
.message-card {
  background: white;
  border-radius: 16px;
  padding: 16px 20px;
  margin-bottom: 12px;
  border-left: 4px solid #cddfe7;
}
.message-card.unread { border-left-color: #1a5f7a; background: #f0f8fc; }
.msg-header { display: flex; justify-content: space-between; margin-bottom: 8px; }
.msg-time { font-size: 12px; color: #8a9baa; }
.msg-content { font-size: 14px; color: #2c3e50; margin-bottom: 10px; }
.btn-read {
  background: #1a5f7a; color: white; border: none;
  padding: 6px 14px; border-radius: 20px; cursor: pointer; font-size: 12px;
}
.read-label { font-size: 12px; color: #42b883; }
</style>