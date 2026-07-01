<template>
  <div class="section">
    <h3>Medikationsplan</h3>
    <div class="med-list">
      <div
        v-for="med in medications"
        :key="med.id"
        class="med-row"
        :class="{ overdue: isOverdue(med) }"
      >
        <div class="med-info">
          <span class="med-name">{{ med.name }}</span>
          <span class="med-dosis">{{ med.dosage }}</span>
          <span class="med-time">— {{ med.time }}</span>
          <span v-if="isOverdue(med)" class="reminder-badge">⏰ fällig</span>
        </div>

        <div class="med-controls">
          <SlideToConfirm
            :confirmed="!!med.reminderActive"
            label="Erinnerung aktivieren"
            confirmedLabel="Erinnerung aktiv"
            @confirm="activateReminder(med)"
          />
          <label class="check-label">
            <input type="checkbox" v-model="med.taken" @change="emit('update', medications)" />
            <span>genommen</span>
          </label>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import SlideToConfirm from './SlideToConfirm.vue'

const props = defineProps({
  medications: Array
})
const emit = defineEmits(['update'])

const now = ref(new Date())
let interval = null
const firedToday = new Set() // verhindert mehrfaches Auslösen pro Tag/Medikament

onMounted(() => {
  if (typeof Notification !== 'undefined' && Notification.permission === 'default') {
    Notification.requestPermission()
  }
  interval = setInterval(checkReminders, 15000)
})
onUnmounted(() => clearInterval(interval))

function isOverdue(med) {
  if (med.taken || !med.time) return false
  const [h, m] = med.time.split(':').map(Number)
  const dose = new Date(now.value)
  dose.setHours(h, m, 0, 0)
  return now.value >= dose
}

function activateReminder(med) {
  med.reminderActive = true
  emit('update', props.medications)
}

function checkReminders() {
  now.value = new Date()
  props.medications.forEach(med => {
    if (!med.reminderActive || med.taken || !med.time) return
    const [h, m] = med.time.split(':').map(Number)
    const dose = new Date(now.value)
    dose.setHours(h, m, 0, 0)
    const key = `${med.id}-${now.value.toDateString()}`

    if (now.value >= dose && !firedToday.has(key)) {
      firedToday.add(key)
      notify(med)
    }
  })
}

function notify(med) {
  const text = `Zeit für ${med.name} (${med.dosage})`
  if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
    new Notification('Medikamenten-Erinnerung', { body: text })
  } else {
    console.log(text)
  }
}
</script>

<style scoped>
.section h3 { margin-bottom: 12px; font-size: 16px; }
.med-list { background: white; border-radius: 20px; overflow: hidden; }
.med-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  padding: 16px 20px;
  border-bottom: 1px solid #eef2f5;
  flex-wrap: wrap;
}
.med-row.overdue { background: #fff6f0; }
.med-info { display: flex; align-items: center; flex-wrap: wrap; gap: 4px; min-width: 180px; }
.med-name { font-weight: 600; }
.med-dosis, .med-time { font-size: 13px; color: #5a6e7c; margin-left: 8px; }
.reminder-badge {
  margin-left: 8px;
  font-size: 12px;
  background: #ffe3cc;
  color: #b15c00;
  padding: 2px 8px;
  border-radius: 12px;
}
.med-controls { display: flex; align-items: center; gap: 16px; flex-wrap: wrap; }
.med-controls > :first-child { flex: 1 1 220px; min-width: 220px; }
.check-label { display: flex; align-items: center; gap: 6px; font-size: 14px; cursor: pointer; white-space: nowrap; }
</style>