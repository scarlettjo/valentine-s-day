<template>
  <div class="controls">
    <button
      class="ctrl"
      type="button"
      @touchstart.prevent="$emit('moveStart', -1)"
      @touchend.prevent="$emit('moveStop')"
      @touchcancel.prevent="$emit('moveStop')"
      @mousedown.prevent="$emit('moveStart', -1)"
      @mouseup.prevent="$emit('moveStop')"
      @mouseleave.prevent="$emit('moveStop')"
    >
      ◀
    </button>

    <button
      class="ctrl"
      type="button"
      @touchstart.prevent="$emit('moveStart', 1)"
      @touchend.prevent="$emit('moveStop')"
      @touchcancel.prevent="$emit('moveStop')"
      @mousedown.prevent="$emit('moveStart', 1)"
      @mouseup.prevent="$emit('moveStop')"
      @mouseleave.prevent="$emit('moveStop')"
    >
      ▶
    </button>
  </div>
</template>

<script setup>
defineEmits(["moveStart", "moveStop"]);
</script>

<style scoped>
.controls {
  position: absolute;
  left: 0;
  right: 0;
  bottom: clamp(16px, 5vh, 40px);
  display: flex;
  justify-content: space-between;
  padding: 0 clamp(12px, 6vw, 32px);
  z-index: 10;
}

.ctrl {
  width: clamp(56px, 14vw, 80px);
  height: clamp(56px, 14vw, 80px);
  border-radius: 50%;
  border: 3px solid #fff;
  background: rgba(255,255,255,0.28);
  color: #fff;
  font-size: clamp(22px, 6vw, 30px);
  display: grid;
  place-items: center;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
}
</style>
