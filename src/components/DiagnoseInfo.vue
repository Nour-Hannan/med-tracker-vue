<template>
  <div class="info-box">
    <div class="info-row">
      <span class="info-label">Diagnose</span>
      <span>{{ diagnose }}</span>
    </div>
    <div class="info-row">
      <span class="info-label">Nächster Arzttermin</span>
      <span>{{ naechsterTermin || 'Kein Termin geplant' }}</span>
    </div>
  </div>
</template>

<script setup>
defineProps({
  diagnose: String,
  naechsterTermin: String
})
</script>

<style scoped>
.info-box { background: white; border-radius: 20px; padding: 20px; margin: 24px 0; }
.info-row {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid #eef2f5;
}
.info-row:last-child { border-bottom: none; }
.info-label { font-weight: 600; color: #1a5f7a; }
</style>