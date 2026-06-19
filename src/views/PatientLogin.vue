<template>
  <div class="login-container">
    <div class="login-card">
      <h1>MedTracker</h1>
      <p class="subtitle">Therapiebegleitung für Arzt & Patient</p>

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
        @keyup.enter="login"
      />

      <button @click="login" class="login-btn">Anmelden</button>

      <div class="demo-hint">
        <p>🔹 Patient: p@web.de / 123</p>
        <p>🔹 Arzt: a@web.de / 123</p>
      </div>
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
  if (email.value === 'p@web.de' && password.value === '123') {
    localStorage.setItem('role', 'patient')
    localStorage.setItem('loggedIn', 'true')
    router.push('/patient/dashboard')
  } else if (email.value === 'a@web.de' && password.value === '123') {
    localStorage.setItem('role', 'doctor')
    localStorage.setItem('loggedIn', 'true')
    router.push('/arzt')
  } else {
    alert('Falsche Zugangsdaten')
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

.subtitle {
  color: #5a6874;
  margin-bottom: 28px;
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
