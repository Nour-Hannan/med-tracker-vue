<template>
  <div class="slide-wrapper" :class="{ done: confirmed }">
    <div class="slide-track" ref="track">
      <div
        class="slide-handle"
        ref="handle"
        :style="{ transform: `translateX(${offset}px)` }"
        @mousedown="startDrag"
        @touchstart="startDrag"
      >
        <span v-if="!confirmed">→</span>
        <span v-else>✓</span>
      </div>
     <span class="slide-label">{{ confirmed ? confirmedLabel : label }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref, onUnmounted } from 'vue'

const props = defineProps({
  label: { type: String, default: 'Zum Bestätigen schieben' },
  confirmedLabel: { type: String, default: 'Bestätigt' },
  confirmed: { type: Boolean, default: false }
})
const emit = defineEmits(['confirm'])

const track = ref(null)
const handle = ref(null)
const offset = ref(0)
let dragging = false
let maxOffset = 0

function startDrag(e) {
  if (props.confirmed) return
  dragging = true
  maxOffset = track.value.clientWidth - handle.value.clientWidth - 4
  window.addEventListener('mousemove', onDrag)
  window.addEventListener('touchmove', onDrag, { passive: false })
  window.addEventListener('mouseup', endDrag)
  window.addEventListener('touchend', endDrag)
}

function getX(e) {
  return e.touches ? e.touches[0].clientX : e.clientX
}

let startX = null
function onDrag(e) {
  if (!dragging) return
  if (e.cancelable) e.preventDefault()
  if (startX === null) startX = getX(e)
  const delta = getX(e) - startX
  offset.value = Math.min(Math.max(delta, 0), maxOffset)
}

function endDrag() {
  dragging = false
  startX = null
  if (offset.value > maxOffset * 0.85) {
    offset.value = maxOffset
    emit('confirm')
  } else {
    offset.value = 0
  }
  window.removeEventListener('mousemove', onDrag)
  window.removeEventListener('touchmove', onDrag)
  window.removeEventListener('mouseup', endDrag)
  window.removeEventListener('touchend', endDrag)
}

onUnmounted(() => {
  window.removeEventListener('mousemove', onDrag)
  window.removeEventListener('touchmove', onDrag)
  window.removeEventListener('mouseup', endDrag)
  window.removeEventListener('touchend', endDrag)
})
</script>

<style scoped>
.slide-wrapper {
  width: 100%;
  min-width: 220px;
}
.slide-track {
  position: relative;
  height: 44px;
  background: #eef2f5;
  border-radius: 24px;
  display: flex;
  align-items: center;
  overflow: hidden;
  padding-left: 44px; 
}
.slide-label {
  width: 100%;
  text-align: center;
  font-size: 12px;
  white-space: nowrap;
  color: #5a6e7c;
  pointer-events: none;
}
.slide-wrapper.done .slide-track { background: #d1f5e0; }
.slide-handle {
  position: absolute;
  left: 2px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #1a5f7a;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: grab;
  user-select: none;
  touch-action: none;
  transition: background 0.2s;
  z-index: 1;
}
.slide-wrapper.done .slide-handle { background: #42b883; cursor: default; }
.slide-label {
  width: 100%;
  text-align: center;
  font-size: 13px;
  color: #5a6e7c;
  pointer-events: none;
}
</style>