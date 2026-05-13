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
      </nav>
      <button @click="logout" class="back-btn">Abmelden</button>
    </div>

    <div class="main-content">
      <!-- Patienten-Tab -->
      <div v-if="activeTab === 'patients'">
        <div class="header">
          <h1>Meine Patienten</h1>
          <button @click="showAddPatient = true" class="btn-primary">+ Neuer Patient</button>
        </div>

        <div class="patient-list">
          <div v-for="patient in patients" :key="patient.id" class="patient-card">
            <div class="patient-info">
              <div class="patient-avatar">👤</div>
              <div>
                <h3>{{ patient.name }}</h3>
                <p class="patient-diagnose">{{ patient.diagnose }}</p>
              </div>
            </div>
            <div class="patient-actions">
              <button @click="selectPatient(patient)" class="btn-prescribe">Medikament verschreiben</button>
              <button @click="deletePatient(patient.id)" class="btn-delete">Löschen</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Verschreibungen-Tab -->
      <div v-if="activeTab === 'prescriptions'">
        <div class="header">
          <h1>Alle Verschreibungen</h1>
        </div>
        <div class="prescription-list">
          <div v-for="prescription in allPrescriptions" :key="prescription.id" class="prescription-card">
            <div>
              <strong>{{ prescription.patientName }}</strong> — {{ prescription.medicationName }}
              <span class="dosage">{{ prescription.dosage }}</span>
            </div>
            <div class="prescription-time">Täglich um {{ prescription.time }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal: Neuer Patient -->
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

    <!-- Modal: Medikament verschreiben -->
    <div v-if="selectedPatient" class="modal-overlay" @click.self="selectedPatient = null">
      <div class="modal">
        <h2>Medikament verschreiben für {{ selectedPatient.name }}</h2>
        <input v-model="newMedication.name" placeholder="Medikament" class="modal-input" />
        <input v-model="newMedication.dosage" placeholder="Dosierung" class="modal-input" />
        <input v-model="newMedication.time" placeholder="Uhrzeit (z.B. 08:00)" class="modal-input" />
        <div class="modal-buttons">
          <button @click="addPrescription" class="btn-primary">Verschreiben</button>
          <button @click="selectedPatient = null" class="btn-secondary">Abbrechen</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const activeTab = ref('patients')
const showAddPatient = ref(false)
const selectedPatient = ref(null)

const patients = ref([
  { id: 1, name: 'Anna Schmidt', diagnose: 'Hypertonie' },
  { id: 2, name: 'Max Mustermann', diagnose: 'Diabetes Typ 2' }
])

const prescriptions = ref([
  { id: 1, patientId: 1, patientName: 'Anna Schmidt', medicationName: 'Ramipril', dosage: '5mg', time: '08:00' },
  { id: 2, patientId: 1, patientName: 'Anna Schmidt', medicationName: 'Metoprolol', dosage: '25mg', time: '20:00' },
  { id: 3, patientId: 2, patientName: 'Max Mustermann', medicationName: 'Metformin', dosage: '500mg', time: '07:00' }
])

const newPatient = ref({ name: '', diagnose: '' })
const newMedication = ref({ name: '', dosage: '', time: '' })

const allPrescriptions = computed(() => prescriptions.value)

function addPatient() {
  if (newPatient.value.name) {
    const newId = Math.max(...patients.value.map(p => p.id), 0) + 1
    patients.value.push({
      id: newId,
      name: newPatient.value.name,
      diagnose: newPatient.value.diagnose || 'Keine Diagnose'
    })
    newPatient.value = { name: '', diagnose: '' }
    showAddPatient.value = false
  }
}

function deletePatient(id) {
  patients.value = patients.value.filter(p => p.id !== id)
  prescriptions.value = prescriptions.value.filter(p => p.patientId !== id)
}

function selectPatient(patient) {
  selectedPatient.value = patient
}

function addPrescription() {
  if (selectedPatient.value && newMedication.value.name) {
    const newId = Math.max(...prescriptions.value.map(p => p.id), 0) + 1
    prescriptions.value.push({
      id: newId,
      patientId: selectedPatient.value.id,
      patientName: selectedPatient.value.name,
      medicationName: newMedication.value.name,
      dosage: newMedication.value.dosage || '—',
      time: newMedication.value.time || '12:00'
    })
    newMedication.value = { name: '', dosage: '', time: '' }
    selectedPatient.value = null
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
  if (!isLoggedIn || role !== 'doctor') {
    router.push('/')
  }
})
</script>

<style scoped>
.dashboard {
  display: flex;
  min-height: 100vh;
  background: #f0f4f8;
}

.sidebar {
  width: 260px;
  background: white;
  box-shadow: 2px 0 12px rgba(0,0,0,0.05);
  padding: 24px 16px;
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.logo h2 {
  color: #1a5f7a;
  font-size: 20px;
}

.role-badge {
  display: inline-block;
  background: #e8f4f8;
  color: #1a5f7a;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  margin-top: 8px;
}

nav {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

nav button {
  background: none;
  border: none;
  padding: 12px 16px;
  text-align: left;
  font-size: 16px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;
  color: #2c3e50;
}

nav button:hover {
  background: #e8f4f8;
}

nav button.active {
  background: #1a5f7a;
  color: white;
}

.back-btn {
  margin-top: auto;
  background: #eef2f5;
  border: none;
  padding: 10px;
  border-radius: 12px;
  cursor: pointer;
  font-size: 14px;
}

.main-content {
  flex: 1;
  padding: 32px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.btn-primary {
  background: #1a5f7a;
  color: white;
  border: none;
  padding: 8px 20px;
  border-radius: 30px;
  cursor: pointer;
  font-size: 14px;
}

.patient-list, .prescription-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.patient-card {
  background: white;
  border-radius: 20px;
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

.patient-info {
  display: flex;
  gap: 16px;
  align-items: center;
}

.patient-avatar {
  font-size: 40px;
}

.patient-diagnose {
  font-size: 13px;
  color: #6c7a89;
}

.btn-prescribe {
  background: #42b883;
  color: white;
  border: none;
  padding: 6px 16px;
  border-radius: 20px;
  cursor: pointer;
  margin-right: 8px;
}

.btn-delete {
  background: #e74c3c;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 20px;
  cursor: pointer;
}

.prescription-card {
  background: white;
  border-radius: 16px;
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-left: 4px solid #42b883;
}

.dosage {
  background: #e8f4f8;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
  margin-left: 8px;
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

.modal {
  background: white;
  border-radius: 24px;
  padding: 28px;
  width: 90%;
  max-width: 400px;
}

.modal-input {
  width: 100%;
  padding: 12px;
  margin: 8px 0;
  border: 1px solid #ddd;
  border-radius: 12px;
  font-size: 14px;
}

.modal-buttons {
  display: flex;
  gap: 12px;
  margin-top: 20px;
}

.btn-secondary {
  background: #eef2f5;
  border: none;
  padding: 8px 20px;
  border-radius: 30px;
  cursor: pointer;
}
</style>
