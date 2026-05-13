<template>
  <div class="patient-dashboard">
    <div class="header-card">
      <div class="welcome">
        <h1>👋 Hallo, {{ patientName }}</h1>
        <p>Ihr persönlicher Medikationsplan</p>
      </div>
      <button @click="goBack" class="back-home">← Zurück</button>
    </div>

    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon">💊</div>
        <div class="stat-info">
          <h3>{{ medications.length }}</h3>
          <p>Aktive Medikamente</p>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">📅</div>
        <div class="stat-info">
          <h3>{{ nextAppointment }}</h3>
          <p>Nächster Arzttermin</p>
        </div>
      </div>
    </div>

    <div class="section">
      <h2>📋 Mein Medikationsplan</h2>
      <div class="medication-list">
        <div v-for="med in medications" :key="med.id" class="med-item">
          <div class="med-icon">💊</div>
          <div class="med-details">
            <strong>{{ med.name }}</strong>
            <span class="dosage">{{ med.dosage }}</span>
            <span class="time">🕐 {{ med.time }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="section">
      <h2>🏥 Meine Diagnose</h2>
      <div class="diagnose-card">
        <p>{{ diagnose }}</p>
      </div>
    </div>

    <!-- Chat-Button -->
    <button @click="showChat = true" class="chat-button">
      💬 Chat mit Arzt
    </button>

    <!-- Chat-Modal -->
    <div v-if="showChat" class="modal-overlay" @click.self="showChat = false">
      <div class="chat-modal">
        <div class="chat-header">
          <h3>💬 Nachricht an Ihren Arzt</h3>
          <button @click="showChat = false" class="close-chat">✕</button>
        </div>
        <div class="chat-messages">
          <div class="message patient">
            <p>Hallo, ich habe eine Frage zu meinen Medikamenten.</p>
            <span class="time">Gerade eben</span>
          </div>
          <div class="message doctor">
            <p>Ihr Arzt wird sich bei Ihnen melden. Diese Demo zeigt nur das UI.</p>
            <span class="time">Demo-Modus</span>
          </div>
        </div>
        <div class="chat-input">
          <input type="text" placeholder="Nachricht schreiben..." v-model="chatMessage" />
          <button @click="sendMessage">📤</button>
        </div>
        <p class="demo-note">ℹ️ Demo: Hier wird keine echte Nachricht gesendet.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const showChat = ref(false)
const chatMessage = ref('')

const patientName = ref('Anna Schmidt')
const diagnose = ref('Hypertonie (Bluthochdruck) - Regelmäßige Kontrolle erforderlich')
const nextAppointment = ref('15. Juni 2026, 10:30 Uhr')

const medications = ref([
  { id: 1, name: 'Ramipril', dosage: '5mg', time: '08:00' },
  { id: 2, name: 'Metoprolol', dosage: '25mg', time: '20:00' }
])

function sendMessage() {
  if (chatMessage.value.trim()) {
    // Nur UI-Demo – keine echte Funktion
    alert('Demo: Ihre Nachricht "' + chatMessage.value + '" würde an den Arzt gesendet werden.')
    chatMessage.value = ''
  }
}

function goBack() {
  router.push('/')
}
</script>

<style scoped>
.patient-dashboard {
  min-height: 100vh;
  background: #f0f7fc;
  padding: 24px;
  max-width: 800px;
  margin: 0 auto;
}

.header-card {
  background: linear-gradient(135deg, #1a5f7a 0%, #0e4156 100%);
  border-radius: 28px;
  padding: 24px;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.welcome h1 {
  font-size: 24px;
  margin-bottom: 6px;
}

.back-home {
  background: rgba(255,255,255,0.2);
  border: none;
  color: white;
  padding: 8px 16px;
  border-radius: 30px;
  cursor: pointer;
}

.stats-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 28px;
}

.stat-card {
  background: white;
  border-radius: 20px;
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 14px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

.stat-icon {
  font-size: 36px;
}

.stat-info h3 {
  font-size: 28px;
  color: #1a5f7a;
}

.stat-info p {
  font-size: 13px;
  color: #6c7a89;
}

.section {
  margin-bottom: 28px;
}

.section h2 {
  margin-bottom: 16px;
  font-size: 18px;
  color: #2c3e50;
}

.medication-list {
  background: white;
  border-radius: 20px;
  overflow: hidden;
}

.med-item {
  display: flex;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #eef2f5;
  gap: 14px;
}

.med-icon {
  font-size: 28px;
}

.med-details {
  flex: 1;
}

.dosage {
  background: #e8f4f8;
  padding: 2px 10px;
  border-radius: 16px;
  font-size: 12px;
  margin-left: 10px;
}

.time {
  display: block;
  font-size: 12px;
  color: #6c7a89;
  margin-top: 4px;
}

.diagnose-card {
  background: white;
  border-radius: 20px;
  padding: 20px;
  border-left: 5px solid #42b883;
}

.chat-button {
  position: fixed;
  bottom: 24px;
  right: 24px;
  background: #1a5f7a;
  color: white;
  border: none;
  padding: 14px 24px;
  border-radius: 40px;
  font-size: 16px;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(26,95,122,0.3);
  display: flex;
  align-items: center;
  gap: 8px;
  z-index: 100;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.chat-modal {
  background: white;
  border-radius: 28px;
  width: 90%;
  max-width: 450px;
  height: 550px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.chat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background: #1a5f7a;
  color: white;
}

.close-chat {
  background: none;
  border: none;
  color: white;
  font-size: 24px;
  cursor: pointer;
}

.chat-messages {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.message {
  max-width: 80%;
  padding: 10px 14px;
  border-radius: 18px;
}

.message.patient {
  background: #1a5f7a;
  color: white;
  align-self: flex-end;
  border-bottom-right-radius: 4px;
}

.message.doctor {
  background: #eef2f5;
  color: #2c3e50;
  align-self: flex-start;
  border-bottom-left-radius: 4px;
}

.message .time {
  font-size: 10px;
  opacity: 0.7;
  display: block;
  margin-top: 4px;
}

.chat-input {
  display: flex;
  padding: 16px;
  gap: 10px;
  border-top: 1px solid #eef2f5;
}

.chat-input input {
  flex: 1;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 25px;
  outline: none;
}

.chat-input button {
  background: #1a5f7a;
  border: none;
  padding: 8px 20px;
  border-radius: 25px;
  color: white;
  cursor: pointer;
}

.demo-note {
  text-align: center;
  font-size: 11px;
  color: #aaa;
  padding: 8px;
}
</style>
