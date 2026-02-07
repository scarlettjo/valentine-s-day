<template>
  <div class="overlay">
    <div class="dialog" :class="{ bounce }" role="dialog" aria-modal="true">
      <div class="content">
        <div class="text">{{ text }}</div>
      </div>

      <div class="actions" v-if="buttons?.length">
        <button
          v-for="b in buttons"
          :key="b.key"
          class="btn"
          :class="b.variant"
          type="button"
          @click="$emit('clickBtn', b.key)"
        >
          {{ b.label }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: { type: String, default: "" },
  text: { type: String, required: true },
  buttons: { type: Array, default: () => [] },
  bounce: { type: Boolean, default: false },
});
defineEmits(["clickBtn"]);
</script>

<style scoped>
.overlay {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  padding: 16px;
}

.dialog {
  width: min(720px, 88vw);
  max-height: min(70vh, 520px);
  background: #fff;
  border: 3px solid #f2a7c6;
  box-shadow: 0 10px 30px rgba(0,0,0,0.25);
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.content {
  padding: 16px 16px 0 16px;
  flex: 1;
  overflow: hidden;
}

.text {
  white-space: pre-line;
  overflow-y: auto;
  max-height: 100%;
  padding-right: 4px;
  -webkit-overflow-scrolling: touch;
  line-height: 1.6;
  color: #333;
  font-size: 16px;
}

.actions {
  display: flex;
  gap: 12px;
  padding: 12px 16px;
  justify-content: center;
  border-top: 1px solid rgba(0,0,0,0.08);
  background: #fff;
  padding-bottom: calc(12px + env(safe-area-inset-bottom));
}

.btn {
  border: 0;
  border-radius: 10px;
  padding: 10px 14px;
  font-size: 14px;
  cursor: pointer;
  user-select: none;
  max-width: 70vw;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.primary {
  background: #fde4ef;
  color: #c94a7c;
}

.ghost {
  background: #ffeef6;
  color: #c94a7c;
}

.bounce {
  animation: bounce 0.12s ease;
}
@keyframes bounce {
  from { transform: scale(0.96); }
  to   { transform: scale(1); }
}
</style>
