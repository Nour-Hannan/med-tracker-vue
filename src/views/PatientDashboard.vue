<template>
  <div class="dashboard">
    <div class="sidebar">
      <div class="logo">
        <h2>MedTracker</h2>
        <span class="role-badge">Patient</span>
      </div>
      <nav>
        <button @click="activeTab = 'overview'" :class="{ active: activeTab === 'overview' }">
          Übersicht
        </button>
        <button @click="activeTab = 'calendar'" :class="{ active: activeTab === 'calendar' }">
          Termine
        </button>
        <button @click="activeTab = 'messages'" :class="{ active: activeTab === 'messages' }">
          Nachrichten
        </button>
      </nav>
      <button @click="logout" class="back-btn">Abmelden</button>
    </div>

    <div class="main-content">

      <!-- Übersicht Tab -->
      <div v-if="activeTab === 'overview'">
        <!-- Willkommen -->
        <div class="welcome-card">
          <div class="avatar">
            <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="8" r="4" />
              <path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8" />
            </svg>
          </div>
          <div>
            <h2>Hallo, {{ patientName }}</h2>
            <p class="subtitle">Ihr Therapieplan</p>
          </div>
        </div>

        <!-- Fortschrittsring -->
        <FortschrittsRing :taken="takenCount" :total="medications.length" />

        <!-- Medikationsplan -->
        <MedikationsplanCard :medications="medications" @update="onMedUpdate" />

        <!-- Diagnose & Termin -->
        <DiagnoseInfo diagnose="Hypertonie, Vitamin-D-Mangel" :naechsterTermin="naechsterBestaetigterTermin" />
      </div>

      <!-- Termine Tab -->
      <div v-if="activeTab === 'calendar'">
        <div class="header"><h1>Termine</h1></div>
        <TerminAnfrage :patientName="patientName" :apiUrl="apiUrl" @appointed="refreshTermine" />
      </div>

      <!-- Nachrichten Tab -->
      <div v-if="activeTab === 'messages'">
        <div class="header"><h1>Nachrichten</h1></div>
        <NachrichtAnArzt :patientName="patientName" :apiUrl="apiUrl" />
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import FortschrittsRing from '../components/FortschrittsRing.vue'
import MedikationsplanCard from '../components/MedicationPlan.vue'
import DiagnoseInfo from '../components/DiagnoseInfo.vue'
import TerminAnfrage from '../components/TerminAnfrage.vue'
import NachrichtAnArzt from '../components/NachrichtAnArzt.vue'

const router = useRouter()
const apiUrl = import.meta.env.VITE_API_BASE_URL
const patientName = ref('Anna Schmidt')
const activeTab = ref('overview')

const medications = ref([])
const takenCount = computed(() => medications.value.filter(m => m.taken).length)
const naechsterBestaetigterTermin = ref('')

function onMedUpdate(updatedMeds) {
  medications.value = updatedMeds
  localStorage.setItem('patientMeds', JSON.stringify(updatedMeds))
}

function refreshTermine() {}

async function loadMedications() {
  try {
    const res = await fetch(`${apiUrl}/api/medications?patientName=${encodeURIComponent(patientName.value)}`)
    const data = await res.json()
    medications.value = data.map(m => ({ ...m, taken: false }))
  } catch {
    const saved = localStorage.getItem('patientMeds')
    if (saved) medications.value = JSON.parse(saved)
    else medications.value = [
      { id: 1, name: 'Ramipril', dosage: '5mg', time: '08:00', taken: false },
      { id: 2, name: 'Metoprolol', dosage: '25mg', time: '20:00', taken: false },
      { id: 3, name: 'Vitamin D3', dosage: '1000 IE', time: '10:00', taken: false },
    ]
  }
}

function logout() {
  localStorage.removeItem('loggedIn')
  localStorage.removeItem('role')
  router.push('/')
}

onMounted(() => {
  const isLoggedIn = localStorage.getItem('loggedIn')
  const role = localStorage.getItem('role')
  if (!isLoggedIn || role !== 'patient') { router.push('/'); return }
  loadMedications()
})
</script>

<style scoped>
.dashboard { display: flex; min-height: 100vh; background: #f0f4f8; }

.sidebar {
  width: 260px; background: white;
  box-shadow: 2px 0 12px rgba(0,0,0,0.05);
  padding: 24px 16px; display: flex; flex-direction: column; gap: 32px;
}
.logo h2 { color: #1a5f7a; font-size: 20px; }
.role-badge {
  display: inline-block; background: #e8f4f8; color: #1a5f7a;
  padding: 4px 12px; border-radius: 20px; font-size: 12px; margin-top: 8px;
}
nav { display: flex; flex-direction: column; gap: 8px; }
nav button {
  background: none; border: none; padding: 12px 16px;
  text-align: left; font-size: 16px; border-radius: 12px;
  cursor: pointer; color: #2c3e50;
}
nav button:hover { background: #e8f4f8; }
nav button.active { background: #1a5f7a; color: white; }
.back-btn {
  margin-top: auto; background: #eef2f5; border: none;
  padding: 10px; border-radius: 12px; cursor: pointer; font-size: 14px;
}

.main-content { flex: 1; padding: 32px; max-width: 800px; }

.header { margin-bottom: 24px; }
.header h1 { font-size: 28px; }

.welcome-card {
  background: white; border-radius: 28px; padding: 24px;
  display: flex; gap: 16px; align-items: center;
  box-shadow: 0 2px 10px rgba(0,0,0,0.02); margin-bottom: 24px;
}
.avatar {
  width: 64px; height: 64px;
  display: flex; align-items: center; justify-content: center;
  background: #e8f4f8; border-radius: 50%;
  color: #1a5f7a; flex-shrink: 0;
}
.welcome-card h2 { font-size: 22px; margin-bottom: 4px; }
.subtitle { font-size: 14px; color: #6c7a89; }
</style>