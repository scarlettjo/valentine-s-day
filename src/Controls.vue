<template>
  <div class="controls">
    <button
      class="ctrl-btn"
      @pointerdown="emit('start', -1)"
      @pointerup="emit('stop')"
      @pointercancel="emit('stop')"
      @pointerleave="emit('stop')"
    >◀</button>

    <button
      class="ctrl-btn"
      @pointerdown="emit('start', 1)"
      @pointerup="emit('stop')"
      @pointercancel="emit('stop')"
      @pointerleave="emit('stop')"
    >▶</button>
  </div>
</template>

<script setup>
const emit = defineEmits(['start','stop'])
</script>

<style scoped>
.controls{
  position: fixed;
  left: 0;
  right: 0;
  bottom: calc(22px + env(safe-area-inset-bottom));
  display: flex;
  justify-content: space-between;
  padding: 0 22px;
  pointer-events: none;
  z-index: 9999; 
}

.ctrl-btn{
  pointer-events: auto;
  width: 64px;
  height: 64px;
  border-radius: 999px;
  font-size: 24px;
  background: rgba(255,255,255,0.35);
  border: 2px solid rgba(255,255,255,0.75);
  backdrop-filter: blur(6px);
  box-shadow: 0 10px 26px rgba(0,0,0,0.18);
}
.ctrl-btn:active{
  transform: translateY(1px) scale(0.98);
}
</style>
