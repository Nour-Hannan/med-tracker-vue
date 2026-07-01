<template>
  <div class="termin-card">
    <h3>Neuen Termin anfragen</h3>
    <div class="termin-form">
      <input type="date" v-model="date" :min="today" />
      <input type="time" v-model="time" />
      <button @click="send" :disabled="!date || !time" class="btn-primary">
        Termin anfragen
      </button>
    </div>
    <p v-if="success" class="success-msg">✓ Anfrage gesendet – warte auf Bestätigung des Arztes</p>

    <div v-if="myAppointments.length > 0" class="my-appointments">
      <h4>Meine Anfragen</h4>
      <div v-for="appt in myAppointments" :key="appt.id" class="appt-row">
        <span>{{ formatDate(appt.date) }} um {{ appt.time }}</span>
        <span :class="['status-badge', appt.status.toLowerCase()]">{{ statusLabel(appt.status) }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const props = defineProps({
  patientName: String,
  apiUrl: String
})

const date = ref('')
const time = ref('')
const success = ref(false)
const myAppointments = ref([])
const today = new Date().toISOString().split('T')[0]

async function loadAppointments() {
  try {
    const res = await fetch(`${props.apiUrl}/api/appointments`)
    const all = await res.json()
    myAppointments.value = all.filter(a => a.patientName === props.patientName)
  } catch (e) {
    console.error('Termine konnten nicht geladen werden', e)
  }
}

async function send() {
  try {
    await fetch(`${props.apiUrl}/api/appointments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        patientName: props.patientName,
        date: date.value,
        time: time.value
      })
    })
    date.value = ''
    time.value = ''
    success.value = true
    setTimeout(() => success.value = false, 4000)
    await loadAppointments()
  } catch (e) {
    console.error('Anfrage fehlgeschlagen', e)
  }
}

function formatDate(d) {
  return new Date(d).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

function statusLabel(s) {
  return { ANGEFRAGT: '⏳ Ausstehend', BESTAETIGT: '✓ Bestätigt', ABGELEHNT: '✕ Abgelehnt' }[s] || s
}

onMounted(loadAppointments)
</script>

<style scoped>
.termin-card { background: white; border-radius: 20px; padding: 20px; margin-bottom: 24px; }
.termin-card h3 { margin-bottom: 12px; }
.termin-form { display: flex; gap: 10px; flex-wrap: wrap; align-items: center; }
input[type="date"], input[type="time"] {
  padding: 10px 14px;
  border: 1px solid #cddfe7;
  border-radius: 30px;
  font-size: 14px;
}
.btn-primary {
  background: #1a5f7a; color: white; border: none;
  padding: 10px 20px; border-radius: 30px; cursor: pointer;
}
.btn-primary:disabled { background: #aaa; cursor: not-allowed; }
.success-msg { color: #42b883; font-size: 13px; margin-top: 10px; }
.my-appointments { margin-top: 20px; }
.my-appointments h4 { font-size: 14px; color: #5a6e7c; margin-bottom: 8px; }
.appt-row {
  display: flex; justify-content: space-between; align-items: center;
  padding: 8px 0; border-bottom: 1px solid #eef2f5; font-size: 14px;
}
.status-badge {
  padding: 4px 10px; border-radius: 20px; font-size: 12px; font-weight: 600;
}
.angefragt { background: #fff3cd; color: #856404; }
.bestaetigt { background: #d1f5e0; color: #1a7a3f; }
.abgelehnt { background: #fde8e8; color: #c0392b; }
</style>