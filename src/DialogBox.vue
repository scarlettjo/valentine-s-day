<template>
  <div class="overlay">
    <div class="dialog" :class="{ bounce }">
      <div class="header">
        <div class="badge">{{ title }}</div>
      </div>

      <div class="content">
        {{ text }}
      </div>

      <div class="actions">
        <button v-if="hasLeft" class="btn ghost" @click="$emit('left')">要付出勇氣點選這個嘛!</button>
        <button class="btn primary" @click="$emit('right')">關閉</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'

const props = defineProps({
  state: String,
  text: String
})

const hasLeft = computed(() => ['park', 'temple', 'sea'].includes(props.state))

const title = computed(() => {
  const map = { intro: 'Intro', park: 'Park', temple: 'Temple', sea: 'Sea', exit1: 'End' }
  return map[props.state] ?? 'Message'
})

const bounce = ref(false)
watch(() => props.state, () => {
  bounce.value = true
  setTimeout(() => (bounce.value = false), 140)
})
</script>

<style scoped>
.overlay{
  position: fixed;
  inset: 0;
  display: grid;
  place-items: center;
  padding: 16px;
  background: rgba(255, 170, 205, 0.18);
  backdrop-filter: blur(6px);
  z-index: 2147483647;
}
.dialog{
 width: clamp(280px, 82vw, 360px);
  max-height: min(520px, 70vh); 
  background: linear-gradient(180deg, #fff 0%, #fff7fb 100%);
  border: 2px solid rgba(1, 1, 1, 0.9);
  border-radius: 16px;
  box-shadow: 0 18px 60px rgba(0,0,0,0.18);
  padding: 14px 14px 12px;
  display: flex;
  flex-direction: column;
  overflow: hidden;              /* ✅ 防止內容撐破 */
}
.header{
  display:flex;
  justify-content: flex-start;
  margin-bottom: 10px;
}

.badge{
  font-size: 12px;
  letter-spacing: 0.4px;
  padding: 6px 10px;
  border-radius: 999px;
  background: rgba(242, 167, 198, 0.22);
  color: #b14b79;
  border: 1px solid rgba(242, 167, 198, 0.45);
}

.content{
  white-space: pre-line;
  overflow-y: auto;              /* ✅ 內容多就捲 */
  padding: 8px 6px 6px;
  line-height: 1.55;
  flex: 1;
}

.actions{
  display:flex;
  gap: 12px;
  justify-content: center;
  margin-top: 10px;
}

.btn{
  min-width: 110px;
  height: 42px;
  border-radius: 999px;
  font-weight: 700;
  cursor: pointer;
  border: 1px solid transparent;
}

.btn.primary{
  background: #f2a7c6;
  border-color: #f2a7c6;
  color: #fff;
}

.btn.primary:active{
  transform: translateY(1px);
}

.btn.ghost{
  background: rgba(242, 167, 198, 0.12);
  border-color: rgba(242, 167, 198, 0.55);
  color: #b14b79;
}

.bounce{
  animation: bounce 0.14s ease;
}

@keyframes bounce{
  from { transform: scale(0.98); }
  to   { transform: scale(1); }
}
</style>
