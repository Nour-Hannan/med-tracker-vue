<template>
  <div>
    <h1>Terminkalender</h1>
    <p v-if="appointments.length === 0" class="empty">Keine Terminanfragen vorhanden.</p>
    <div v-for="appt in appointments" :key="appt.id" class="appt-card">
      <div class="appt-info">
        <strong>{{ appt.patientName }}</strong>
        <span class="appt-time">{{ formatDate(appt.date) }} um {{ appt.time }}</span>
      </div>
      <div class="appt-actions">
        <span :class="['status-badge', appt.status.toLowerCase()]">{{ statusLabel(appt.status) }}</span>
        <div v-if="appt.status === 'ANGEFRAGT'" class="action-btns">
          <button @click="updateStatus(appt.id, 'BESTAETIGT')" class="btn-confirm">✓ Bestätigen</button>
          <button @click="updateStatus(appt.id, 'ABGELEHNT')" class="btn-reject">✕ Ablehnen</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const props = defineProps({ apiUrl: String })

const appointments = ref([])

async function loadAppointments() {
  try {
    const res = await fetch(`${props.apiUrl}/api/appointments`)
    appointments.value = await res.json()
  } catch (e) {
    console.error('Termine konnten nicht geladen werden', e)
  }
}

async function updateStatus(id, status) {
  await fetch(`${props.apiUrl}/api/appointments/${id}/status?status=${status}`, { method: 'PUT' })
  await loadAppointments()
}

function formatDate(d) {
  return new Date(d).toLocaleDateString('de-DE', { day: '2-digit', month: 'long', year: 'numeric' })
}

function statusLabel(s) {
  return { ANGEFRAGT: '⏳ Ausstehend', BESTAETIGT: '✓ Bestätigt', ABGELEHNT: '✕ Abgelehnt' }[s] || s
}

onMounted(loadAppointments)
</script>

<style scoped>
h1 { margin-bottom: 24px; }
.empty { color: #8a9baa; }
.appt-card {
  background: white; border-radius: 16px; padding: 16px 20px;
  margin-bottom: 12px; display: flex; justify-content: space-between;
  align-items: center; flex-wrap: wrap; gap: 12px;
}
.appt-info { display: flex; flex-direction: column; gap: 4px; }
.appt-time { font-size: 13px; color: #5a6e7c; }
.appt-actions { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
.action-btns { display: flex; gap: 8px; }
.btn-confirm {
  background: #42b883; color: white; border: none;
  padding: 6px 14px; border-radius: 20px; cursor: pointer; font-size: 13px;
}
.btn-reject {
  background: #e74c3c; color: white; border: none;
  padding: 6px 14px; border-radius: 20px; cursor: pointer; font-size: 13px;
}
.status-badge {
  padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600;
}
.angefragt { background: #fff3cd; color: #856404; }
.bestaetigt { background: #d1f5e0; color: #1a7a3f; }
.abgelehnt { background: #fde8e8; color: #c0392b; }
</style>