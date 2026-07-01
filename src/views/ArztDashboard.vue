<template>
  <div class="dashboard">
    <div class="sidebar">
      <div class="logo">
        <h2>MedTracker</h2>
        <span class="role-badge">Arzt</span>
      </div>
      <nav>
        <button @click="activeTab = 'patients'" :class="{ active: activeTab === 'patients' }">
          Patienten
        </button>
        <button @click="activeTab = 'prescriptions'" :class="{ active: activeTab === 'prescriptions' }">
          Verschreibungen
        </button>
        <button @click="activeTab = 'messages'" :class="{ active: activeTab === 'messages' }">
          Nachrichten
          <span v-if="unreadCount > 0" class="badge">{{ unreadCount }}</span>
        </button>
        <button @click="activeTab = 'calendar'" :class="{ active: activeTab === 'calendar' }">
          Termine
          <span v-if="pendingCount > 0" class="badge">{{ pendingCount }}</span>
        </button>
      </nav>
      <button @click="logout" class="back-btn">Abmelden</button>
    </div>

    <div class="main-content">
      <!-- Patienten Tab -->
      <div v-if="activeTab === 'patients'">
        <div class="header">
          <h1>Meine Patienten</h1>
          <button @click="showAddPatient = true" class="btn-primary">+ Neuer Patient</button>
        </div>
        <div class="patient-list">
          <div v-for="patient in patients" :key="patient.id" class="patient-card">
            <div class="patient-info">
              <div class="patient-avatar">
                <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="8" r="4" />
                  <path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8" />
                </svg>
              </div>
              <div>
                <h3>{{ patient.name }}</h3>
                <p class="patient-diagnose">{{ patient.diagnose }}</p>
              </div>
            </div>
            <div class="patient-actions">
              <button @click="openDiagnoseModal(patient)" class="btn-diagnose">Diagnose</button>
              <button @click="selectPatient(patient)" class="btn-prescribe">Medikament</button>
              <button @click="deletePatient(patient.id)" class="btn-delete">Löschen</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Verschreibungen Tab -->
      <div v-if="activeTab === 'prescriptions'">
        <div class="header"><h1>Alle Verschreibungen</h1></div>
        <p v-if="loadingPrescriptions" class="status-text">Lade Verschreibungen ...</p>
        <p v-else-if="prescriptions.length === 0" class="status-text">Noch keine Verschreibungen vorhanden.</p>
        <div class="prescription-list">
          <div v-for="p in prescriptions" :key="p.id" class="prescription-card">
            <div>
              <strong>{{ p.patientName }}</strong> — {{ p.medicationName }}
              <span class="dosage">{{ p.dosage }}</span>
            </div>
            <div class="prescription-actions">
              <span class="prescription-time">Täglich um {{ p.time }}</span>
              <button @click="deletePrescription(p.id)" class="btn-delete-sm">✕</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Nachrichten Tab -->
      <NachrichtenPostfach
        v-if="activeTab === 'messages'"
        :apiUrl="apiUrl"
        @loaded="onMessagesLoaded"
      />

      <!-- Terminkalender Tab -->
      <TerminKalender
        v-if="activeTab === 'calendar'"
        :apiUrl="apiUrl"
        @loaded="onAppointmentsLoaded"
      />
    </div>

    <!-- Modals -->
    <div v-if="showAddPatient" class="modal-overlay" @click.self="showAddPatient = false">
      <div class="modal">
        <h2>Neuer Patient</h2>
        <input v-model="newPatient.name" placeholder="Name" class="modal-input" />
        <input v-model="newPatient.diagnose" placeholder="Diagnose" class="modal-input" />
        <div class="modal-buttons">
          <button @click="addPatient" class="btn-primary">Hinzufügen</button>
          <button @click="showAddPatient = false" class="btn-secondary">Abbrechen</button>
        </div>
      </div>
    </div>

    <div v-if="selectedPatient" class="modal-overlay" @click.self="selectedPatient = null">
      <div class="modal">
        <h2>Medikament für {{ selectedPatient.name }}</h2>
        <input v-model="newMedication.name" placeholder="Medikament" class="modal-input" />
        <input v-model="newMedication.dosage" placeholder="Dosierung" class="modal-input" />
        <input v-model="newMedication.time" placeholder="Uhrzeit z.B. 08:00" class="modal-input" />
        <p v-if="prescriptionError" class="error-text">{{ prescriptionError }}</p>
        <div class="modal-buttons">
          <button @click="addPrescription" class="btn-primary" :disabled="savingPrescription">
            {{ savingPrescription ? 'Speichert ...' : 'Verschreiben' }}
          </button>
          <button @click="selectedPatient = null" class="btn-secondary">Abbrechen</button>
        </div>
      </div>
    </div>

    <div v-if="showDiagnoseModal" class="modal-overlay" @click.self="showDiagnoseModal = false">
      <div class="modal">
        <h2>Diagnose bearbeiten</h2>
        <p class="modal-patient">{{ currentPatient?.name }}</p>
        <input v-model="editedDiagnose" placeholder="Neue Diagnose" class="modal-input" />
        <div class="modal-buttons">
          <button @click="saveDiagnose" class="btn-primary">Speichern</button>
          <button @click="showDiagnoseModal = false" class="btn-secondary">Abbrechen</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import NachrichtenPostfach from '../components/NachrichtenPostfach.vue'
import TerminKalender from '../components/TerminKalender.vue'

const router = useRouter()
const apiUrl = import.meta.env.VITE_API_BASE_URL
const activeTab = ref('patients')

const unreadCount = ref(0)
const pendingCount = ref(0)

function onMessagesLoaded(msgs) {
  unreadCount.value = msgs.filter(m => !m.gelesen).length
}
function onAppointmentsLoaded(appts) {
  pendingCount.value = appts.filter(a => a.status === 'ANGEFRAGT').length
}

const showAddPatient = ref(false)
const selectedPatient = ref(null)
const showDiagnoseModal = ref(false)
const currentPatient = ref(null)
const editedDiagnose = ref('')

const patients = ref([
  { id: 1, name: 'Anna Schmidt', diagnose: 'Hypertonie' },
  { id: 2, name: 'Max Mustermann', diagnose: 'Diabetes Typ 2' }
])

const prescriptions = ref([])
const loadingPrescriptions = ref(false)
const newPatient = ref({ name: '', diagnose: '' })
const newMedication = ref({ name: '', dosage: '', time: '' })
const savingPrescription = ref(false)
const prescriptionError = ref('')

async function loadPrescriptions() {
  loadingPrescriptions.value = true
  try {
    const res = await fetch(`${apiUrl}/api/medications`)
    if (!res.ok) throw new Error(`Status ${res.status}`)
    const data = await res.json()
    prescriptions.value = data.map(m => ({
      id: m.id,
      patientName: m.patientName || '—',
      medicationName: m.name,
      dosage: m.dosage,
      time: m.time
    }))
  } catch (e) {
    console.error('Verschreibungen konnten nicht geladen werden', e)
    prescriptions.value = []
  } finally {
    loadingPrescriptions.value = false
  }
}

function openDiagnoseModal(patient) {
  currentPatient.value = patient
  editedDiagnose.value = patient.diagnose
  showDiagnoseModal.value = true
}
function saveDiagnose() {
  const p = patients.value.find(p => p.id === currentPatient.value.id)
  if (p) p.diagnose = editedDiagnose.value
  showDiagnoseModal.value = false
}
function addPatient() {
  if (!newPatient.value.name) return
  const newId = Math.max(...patients.value.map(p => p.id), 0) + 1
  patients.value.push({ id: newId, ...newPatient.value })
  newPatient.value = { name: '', diagnose: '' }
  showAddPatient.value = false
}
function deletePatient(id) {
  patients.value = patients.value.filter(p => p.id !== id)
  prescriptions.value = prescriptions.value.filter(p => p.patientId !== id)
}
function selectPatient(patient) {
  selectedPatient.value = patient
  prescriptionError.value = ''
}

async function addPrescription() {
  if (!selectedPatient.value || !newMedication.value.name.trim()) return
  savingPrescription.value = true
  prescriptionError.value = ''
  try {
    const res = await fetch(`${apiUrl}/api/medications`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: newMedication.value.name,
        dosage: newMedication.value.dosage || '—',
        time: newMedication.value.time || '12:00',
        patientName: selectedPatient.value.name
      })
    })
    if (!res.ok) throw new Error(`Status ${res.status}`)
    const saved = await res.json()
    if (!saved || !saved.name) throw new Error('Antwort vom Server war unvollständig')
    prescriptions.value.push({
      id: saved.id,
      patientName: selectedPatient.value.name,
      medicationName: saved.name,
      dosage: saved.dosage,
      time: saved.time
    })
    newMedication.value = { name: '', dosage: '', time: '' }
    selectedPatient.value = null
  } catch (e) {
    console.error('Verschreibung fehlgeschlagen', e)
    prescriptionError.value = 'Verschreibung konnte nicht gespeichert werden. Bitte erneut versuchen.'
  } finally {
    savingPrescription.value = false
  }
}

async function deletePrescription(id) {
  try {
    const res = await fetch(`${apiUrl}/api/medications/${id}`, { method: 'DELETE' })
    if (!res.ok) throw new Error(`Status ${res.status}`)
  } catch (e) {
    console.error('Löschen fehlgeschlagen', e)
    return
  }
  prescriptions.value = prescriptions.value.filter(p => p.id !== id)
}

function logout() {
  localStorage.removeItem('loggedIn')
  localStorage.removeItem('role')
  router.push('/')
}

onMounted(() => {
  const isLoggedIn = localStorage.getItem('loggedIn')
  const role = localStorage.getItem('role')
  if (!isLoggedIn || role !== 'doctor') { router.push('/'); return }
  loadPrescriptions()
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
  cursor: pointer; color: #2c3e50; display: flex; justify-content: space-between; align-items: center;
}
nav button:hover { background: #e8f4f8; }
nav button.active { background: #1a5f7a; color: white; }
.badge {
  background: #e74c3c; color: white;
  border-radius: 50%; width: 20px; height: 20px;
  font-size: 11px; display: flex; align-items: center; justify-content: center;
}
.back-btn {
  margin-top: auto; background: #eef2f5; border: none;
  padding: 10px; border-radius: 12px; cursor: pointer; font-size: 14px;
}
.main-content { flex: 1; padding: 32px; }
.header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
.btn-primary {
  background: #1a5f7a; color: white; border: none;
  padding: 8px 20px; border-radius: 30px; cursor: pointer;
}
.btn-primary:disabled { background: #aaa; cursor: not-allowed; }
.status-text { color: #8a9baa; margin-bottom: 16px; }
.error-text { color: #c0392b; font-size: 13px; margin-top: 4px; }
.patient-list, .prescription-list { display: flex; flex-direction: column; gap: 16px; }
.patient-card {
  background: white; border-radius: 20px; padding: 20px;
  display: flex; justify-content: space-between; align-items: center;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05); flex-wrap: wrap; gap: 12px;
}
.patient-info { display: flex; gap: 16px; align-items: center; }
.patient-avatar {
  width: 52px; height: 52px;
  display: flex; align-items: center; justify-content: center;
  background: #e8f4f8; border-radius: 50%;
  color: #1a5f7a; flex-shrink: 0;
}
.patient-diagnose { font-size: 13px; color: #6c7a89; }
.patient-actions { display: flex; gap: 6px; }
.btn-prescribe { background: #42b883; color: white; border: none; padding: 6px 16px; border-radius: 20px; cursor: pointer; }
.btn-delete { background: #e74c3c; color: white; border: none; padding: 6px 12px; border-radius: 20px; cursor: pointer; }
.btn-diagnose { background: #f39c12; color: white; border: none; padding: 6px 16px; border-radius: 20px; cursor: pointer; }
.prescription-card {
  background: white; border-radius: 16px; padding: 16px;
  display: flex; justify-content: space-between; align-items: center;
  border-left: 4px solid #42b883;
}
.dosage { background: #e8f4f8; padding: 2px 8px; border-radius: 12px; font-size: 12px; margin-left: 8px; }
.prescription-actions { display: flex; align-items: center; gap: 12px; }
.prescription-time { font-size: 14px; color: #5a6e7c; }
.btn-delete-sm { background: #e74c3c; color: white; border: none; padding: 4px 8px; border-radius: 20px; cursor: pointer; }
.modal-overlay {
  position: fixed; top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000;
}
.modal { background: white; border-radius: 24px; padding: 28px; width: 90%; max-width: 400px; }
.modal-patient { font-size: 14px; color: #5a6874; margin-bottom: 12px; }
.modal-input { width: 100%; padding: 12px; margin: 8px 0; border: 1px solid #ddd; border-radius: 12px; font-size: 14px; }
.modal-buttons { display: flex; gap: 12px; margin-top: 20px; }
.btn-secondary { background: #eef2f5; border: none; padding: 8px 20px; border-radius: 30px; cursor: pointer; }
</style>