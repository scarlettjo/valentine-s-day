<template>
<div class="dialog">
  <div class="dialog-content">
    {{ text }}
  </div>

  <div class="dialog-actions">
    <button v-if="hasLeft" @click="$emit('left')">亂按</button>
    <button @click="$emit('right')">關閉</button>
  </div>
</div>

</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  state: String,
  text: String
})

const hasLeft = computed(() => ['park', 'temple', 'sea'].includes(props.state))
</script>


<style scoped>
.overlay {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
}
.dialog {
  width: 80%;
  max-height: 70%;
  background: white;
  border: 3px solid pink;
  padding: 16px;
  display: flex;
  flex-direction: column;
}
.text {
  white-space: pre-line;
  overflow-y: auto;
  flex: 1;
}
.actions {
  display: flex;
  gap: 12px;
  justify-content: center;
}
.dialog {
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 75%;
  max-height: 70%;
  background: #fff;
  border: 3px solid #f2a7c6;
  padding: 16px;
  display: flex;
  flex-direction: column;
}

.dialog-content {
  flex: 1;
  overflow-y: auto;
  white-space: pre-line;
}

.dialog-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-top: 12px;
}

.bounce {
  animation: bounce 0.12s ease;
}

@keyframes bounce {
  from { transform: translate(-50%, -50%) scale(0.95); }
  to   { transform: translate(-50%, -50%) scale(1); }
}

</style>
