<template>
  <div class="patient-view">
    <div class="top-bar">
      <span class="logo">MedTracker</span>
      <button @click="logout" class="logout-btn">Abmelden</button>
    </div>

    <div class="content">
      <!-- Willkommen -->
      <div class="welcome-card">
        <div class="avatar">👤</div>
        <div>
          <h2>Hallo, Anna Schmidt</h2>
          <p>Ihr Therapieplan</p>
        </div>
      </div>

      <!-- Fortschrittsring -->
      <div class="progress-card">
        <div class="progress-ring">
          <svg width="100" height="100">
            <circle
              cx="50"
              cy="50"
              r="42"
              stroke="#e0ecf3"
              stroke-width="6"
              fill="none"
            />
            <circle
              cx="50"
              cy="50"
              r="42"
              stroke="#42b883"
              stroke-width="6"
              fill="none"
              :stroke-dasharray="circumference"
              :stroke-dashoffset="progressOffset"
              stroke-linecap="round"
              transform="rotate(-90 50 50)"
            />
          </svg>
          <div class="progress-text">{{ takenPercent }}%</div>
        </div>
        <div class="progress-info">
          <span class="taken-count">{{ takenCount }}</span> von
          <span class="total-count">{{ totalMeds }}</span> Medikamenten
          heute genommen
        </div>
      </div>

      <!-- Medikationsplan mit Checkbox -->
      <div class="section">
        <h3>Medikationsplan</h3>
        <div class="med-list">
          <div
            v-for="med in medications"
            :key="med.id"
            class="med-row"
          >
            <div class="med-info">
              <span class="med-name">{{ med.name }}</span>
              <span class="med-dosis">{{ med.dosage }}</span>
              <span class="med-time">{{ med.time }}</span>
            </div>
            <label class="check-label">
              <input
                type="checkbox"
                v-model="med.taken"
                @change="updateProgress"
              />
              <span>genommen</span>
            </label>
          </div>
        </div>
      </div>

      <!-- Diagnose & Termin -->
      <div class="info-box">
        <div class="info-row">
          <span class="info-label">Diagnose</span>
          <span>Hypertonie, Vitamin-D-Mangel</span>
        </div>
        <div class="info-row">
          <span class="info-label">Nächster Arzttermin</span>
          <span>15. Juni 2026, 10:30 Uhr</span>
        </div>
      </div>

      <!-- Chat-UI -->
      <div class="chat-card">
        <h3>Nachricht an Arzt</h3>
        <textarea
          v-model="chatMessage"
          placeholder="Ihre Frage ..."
        ></textarea>
        <button @click="sendChatMessage" class="chat-send">
          Senden (Demo)
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const chatMessage = ref('')

const medications = ref([
  { id: 1, name: 'Ramipril', dosage: '5mg', time: '08:00', taken: false },
  { id: 2, name: 'Metoprolol', dosage: '25mg', time: '20:00', taken: false },
  { id: 3, name: 'Vitamin D3', dosage: '1000 IE', time: '10:00', taken: false },
  { id: 4, name: 'Magnesium', dosage: '300mg', time: '12:00', taken: false },
  { id: 5, name: 'Omega-3', dosage: '1000mg', time: '18:00', taken: false },
  { id: 6, name: 'Vitamin B12', dosage: '500µg', time: '14:00', taken: false }
])

const totalMeds = computed(() => medications.value.length)
const takenCount = computed(() => medications.value.filter(m => m.taken).length)
const takenPercent = computed(() => Math.round((takenCount.value / totalMeds.value) * 100))

// Fortschrittsring
const circumference = 2 * Math.PI * 42
const progressOffset = computed(() => {
  return circumference - (takenPercent.value / 100) * circumference
})

function updateProgress() {
  localStorage.setItem('patientMeds', JSON.stringify(medications.value))
}

function loadFromLocalStorage() {
  const saved = localStorage.getItem('patientMeds')
  if (saved) {
    medications.value = JSON.parse(saved)
  }
}

function sendChatMessage() {
  if (chatMessage.value.trim()) {
    alert('Ihre Nachricht wurde gesendet (Demo: Arzt antwortet nicht)')
    chatMessage.value = ''
  }
}

function logout() {
  localStorage.removeItem('role')
  localStorage.removeItem('loggedIn')
  router.push('/')
}

onMounted(() => {
  const isLoggedIn = localStorage.getItem('loggedIn')
  const role = localStorage.getItem('role')
  if (!isLoggedIn || role !== 'patient') {
    router.push('/')
  }
  loadFromLocalStorage()
})
</script>

<style scoped>
.patient-view {
  min-height: 100vh;
  background: #f4f9fd;
  font-family: 'Segoe UI', system-ui;
}

.top-bar {
  background: white;
  padding: 16px 32px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e0ecf3;
}

.logo {
  font-size: 20px;
  font-weight: 600;
  color: #1a5f7a;
}

.logout-btn {
  background: none;
  border: 1px solid #cddfe7;
  padding: 6px 14px;
  border-radius: 30px;
  cursor: pointer;
}

.content {
  max-width: 800px;
  margin: 0 auto;
  padding: 32px 20px;
}

.welcome-card {
  background: white;
  border-radius: 28px;
  padding: 24px;
  display: flex;
  gap: 16px;
  align-items: center;
  box-shadow: 0 2px 10px rgba(0,0,0,0.02);
  margin-bottom: 24px;
}

.avatar {
  font-size: 48px;
}

.progress-card {
  background: white;
  border-radius: 28px;
  padding: 24px;
  text-align: center;
  margin-bottom: 32px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.progress-ring {
  position: relative;
  width: 100px;
  height: 100px;
}

.progress-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 18px;
  font-weight: 600;
  color: #1a5f7a;
}

.taken-count {
  font-size: 24px;
  font-weight: 600;
  color: #42b883;
}

.med-list {
  background: white;
  border-radius: 20px;
  overflow: hidden;
}

.med-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #eef2f5;
}

.med-name {
  font-weight: 600;
}

.med-dosis, .med-time {
  font-size: 13px;
  color: #5a6e7c;
  margin-left: 12px;
}

.check-label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  cursor: pointer;
}

.info-box {
  background: white;
  border-radius: 20px;
  padding: 20px;
  margin: 24px 0;
}

.info-row {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid #eef2f5;
}

.info-label {
  font-weight: 600;
  color: #1a5f7a;
}

.chat-card {
  background: white;
  border-radius: 20px;
  padding: 20px;
  margin-bottom: 32px;
}

.chat-card textarea {
  width: 100%;
  padding: 12px;
  border-radius: 16px;
  border: 1px solid #cddfe7;
  margin: 12px 0;
}

.chat-send {
  background: #1a5f7a;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 30px;
  cursor: pointer;
}
</style>
