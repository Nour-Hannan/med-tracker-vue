<template>
  <div class="start-container">
    <div class="card">
      <h1>🏥 MedTracker</h1>
      <p class="subtitle">Ihre Medikationsverwaltung für Arzt und Patient</p>

      <div class="role-buttons">
        <button @click="goToDoctor" class="btn doctor">
          👨‍⚕️ Ich bin Arzt
        </button>
        <button @click="goToPatient" class="btn patient">
          👤 Ich bin Patient
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goToDoctor = () => {
  router.push('/arzt')
}

const goToPatient = () => {
  router.push('/patient')
}
</script>

<style scoped>
.start-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #e8f4f8 0%, #d1e8f0 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.card {
  background: white;
  border-radius: 32px;
  padding: 48px 40px;
  text-align: center;
  box-shadow: 0 20px 40px rgba(0,0,0,0.1);
  max-width: 500px;
  width: 90%;
}

h1 {
  color: #1a5f7a;
  font-size: 42px;
  margin-bottom: 12px;
}

.subtitle {
  color: #5a6874;
  margin-bottom: 40px;
  font-size: 16px;
}

.role-buttons {
  display: flex;
  gap: 20px;
  justify-content: center;
  flex-wrap: wrap;
}

.btn {
  padding: 14px 32px;
  font-size: 18px;
  border: none;
  border-radius: 40px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 600;
}

.doctor {
  background: #1a5f7a;
  color: white;
  box-shadow: 0 4px 10px rgba(26,95,122,0.3);
}

.doctor:hover {
  background: #0e4156;
  transform: translateY(-2px);
}

.patient {
  background: #42b883;
  color: white;
  box-shadow: 0 4px 10px rgba(66,184,131,0.3);
}

.patient:hover {
  background: #359f6b;
  transform: translateY(-2px);
}
</style>
