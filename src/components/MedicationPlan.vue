<template>
  <div class="plan-container">
    <h2> Medikationsplan</h2>
    <div v-for="med in meds" :key="med.id" class="med-card">
      <strong>{{ med.name }}</strong> — {{ med.dosage }} ({{ med.time }})
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const meds = ref([
  { id: 1, name: 'L-Thyroxin', dosage: '50µg', time: '07:00' },
  { id: 2, name: 'Ibuprofen', dosage: '400mg', time: '12:00' },
  { id: 3, name: 'Magnesium', dosage: '300mg', time: '20:00' }
])
</script>

<style scoped>
.plan-container { padding: 20px; border: 2px solid #42b883; border-radius: 12px; background: white; }
.med-card { margin: 0 auto;  max-width: 800px; padding: 10px; background: #f0f7f4; border-radius: 6px; }
</style>

  