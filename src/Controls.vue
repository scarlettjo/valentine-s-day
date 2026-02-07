<template>
  <div class="controls">
    <button @touchstart="$emit('start', -1)" @touchend="$emit('stop')">◀</button>
    <button @touchstart="$emit('start', 1)" @touchend="$emit('stop')">▶</button>
  </div>
</template>

<style scoped>
.controls {
  position: absolute;
  bottom: 24px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  padding: 0 24px;
}
button {
  width: 64px;
  height: 64px;
  border-radius: 50%;
}
.controls {
  position: fixed;
  bottom: 24px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 0 24px;
}

.ctrl-btn {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  font-size: 24px;
  background: rgba(255,255,255,0.3);
  border: 2px solid #fff;
}

</style>
