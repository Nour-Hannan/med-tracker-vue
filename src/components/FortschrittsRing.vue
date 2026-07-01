<template>
  <div class="progress-card">
    <div class="progress-ring">
      <svg width="100" height="100">
        <circle cx="50" cy="50" r="42" stroke="#e0ecf3" stroke-width="6" fill="none" />
        <circle
          cx="50" cy="50" r="42"
          stroke="#42b883" stroke-width="6" fill="none"
          :stroke-dasharray="circumference"
          :stroke-dashoffset="progressOffset"
          stroke-linecap="round"
          transform="rotate(-90 50 50)"
        />
      </svg>
      <div class="progress-text">{{ percent }}%</div>
    </div>
    <div class="progress-info">
      <span class="taken-count">{{ taken }}</span> von
      <span class="total-count">{{ total }}</span> Medikamenten heute genommen
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  taken: Number,
  total: Number
})

const percent = computed(() => props.total === 0 ? 0 : Math.round((props.taken / props.total) * 100))
const circumference = 2 * Math.PI * 42
const progressOffset = computed(() => circumference - (percent.value / 100) * circumference)
</script>

<style scoped>
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
.progress-ring { position: relative; width: 100px; height: 100px; }
.progress-text {
  position: absolute; top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  font-size: 18px; font-weight: 600; color: #1a5f7a;
}
.taken-count { font-size: 24px; font-weight: 600; color: #42b883; }
</style>