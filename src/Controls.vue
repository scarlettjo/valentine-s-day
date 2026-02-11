<template>
  <div class="controls">
    <button
      class="ctrl-btn"
      @touchstart.prevent="emit('start', -1)"
      @touchend.prevent="emit('stop')"
      @touchcancel.prevent="emit('stop')"
      @mousedown.prevent="emit('start', -1)"
      @mouseup.prevent="emit('stop')"
      @mouseleave.prevent="emit('stop')"
    >◀</button>

    <button
      class="ctrl-btn"
      @touchstart.prevent="emit('start', 1)"
      @touchend.prevent="emit('stop')"
      @touchcancel.prevent="emit('stop')"
      @mousedown.prevent="emit('start', 1)"
      @mouseup.prevent="emit('stop')"
      @mouseleave.prevent="emit('stop')"
    >▶</button>
  </div>
</template>

<script setup>
const emit = defineEmits(['start', 'stop'])
</script>

<style scoped>
.controls{
  position: fixed;
  left: 0;
  right: 0;
  bottom: calc(80px + env(safe-area-inset-bottom)); /* ✅ 往上抬，避開 Safari 工具列 */
  display: flex;
  justify-content: space-between;
  padding: 0 22px;
  z-index: 2147483647; /* ✅ 一定在最上層 */
}

.ctrl-btn{
  width: 64px;
  height: 64px;
  border-radius: 999px;
  font-size: 24px;
  background: rgba(255,255,255,0.85); /* ✅ 不透明，肉眼一定看得到 */
  border: 2px solid rgba(242, 167, 198, 0.9);
  box-shadow: 0 10px 26px rgba(0,0,0,0.22);
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
}

.ctrl-btn:active{
  transform: translateY(1px) scale(0.98);
}
</style>
