<template>
  <div class="login-container">
    <div class="login-card">
      <h1>🏥 MedTracker</h1>
      <h2>Patienten-Login</h2>

      <input
        type="email"
        v-model="email"
        placeholder="E-Mail"
        class="login-input"
      />
      <input
        type="password"
        v-model="password"
        placeholder="Passwort"
        class="login-input"
      />

      <button @click="login" class="login-btn">Anmelden</button>

      <p class="demo-hint">
        Demo-Zugang:<br />
        patient@example.com / 123
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const email = ref('')
const password = ref('')
const router = useRouter()

function login() {
  if (email.value === 'patient@example.com' && password.value === '123') {
    localStorage.setItem('patientLoggedIn', 'true')
    router.push('/patient/dashboard')
  } else {
    alert('Falsche Zugangsdaten (Demo: patient@example.com / 123)')
  }
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  background: #eef5fa;
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-card {
  background: white;
  padding: 40px;
  border-radius: 32px;
  box-shadow: 0 12px 28px rgba(0,0,0,0.08);
  width: 360px;
  text-align: center;
}

h1 {
  color: #1a5f7a;
  font-size: 32px;
  margin-bottom: 8px;
}

h2 {
  font-size: 20px;
  margin-bottom: 24px;
  color: #2c3e50;
}

.login-input {
  width: 100%;
  padding: 12px;
  margin: 8px 0;
  border: 1px solid #cddfe7;
  border-radius: 28px;
  font-size: 14px;
}

.login-btn {
  width: 100%;
  background: #1a5f7a;
  color: white;
  border: none;
  padding: 12px;
  border-radius: 28px;
  font-size: 16px;
  cursor: pointer;
  margin-top: 16px;
}

.demo-hint {
  font-size: 12px;
  color: #7f8c8d;
  margin-top: 24px;
}
</style>
