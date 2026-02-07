<template>
  <div
  class="scene"
  :style="{ backgroundImage: `url(${currentBg})` }"
></div>



    <!-- 人物 -->
    <img
      v-if="parkVisible"
      class="char"
      :src="boySrc"
      :style="styleOf(p1)"
      draggable="false"
    />
    <img
      v-if="parkVisible"
      class="char"
      :src="meSrc"
      :style="styleOf(p2)"
      draggable="false"
    />

    <!-- 對話框 -->
    <DialogBox
      v-if="showDialog"
      :state="dialogState"
      :text="dialogText"
      @left="onDialogLeft"
      @right="onDialogRight"
    />

    <!-- 控制鍵 -->
    <Controls
      v-if="parkVisible && !showDialog"
      @start="moveDir = $event"
      @stop="moveDir = 0"
    />
  
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import DialogBox from './DialogBox.vue'
import Controls from './Controls.vue'

/* ===== 狀態 ===== */
const dialogState = ref('intro')
const showDialog = ref(true)
const parkVisible = ref(false)

const DIALOG_TEXT = {
  intro: `嗨!周小寶,今天是難得的情人節,
我想說給你一個驚喜，順邊發揮所長(?)

前陣子花了點時間在用電腦,
就是因為這個喔!希望你不要擔心~

點擊右下角的按鈕吧!`,
  park: `這裡是不是很熟悉呢?
這是寶寶跟我告白的瓶蓋公園呦!

再點一次右下角吧!`,
  temple: `洪爐地的故事...`,
  sea: `海邊的回憶...`,
  exit1: `恭喜你獲得被榨乾機會乙次`
}

const dialogText = computed(() => DIALOG_TEXT[dialogState.value])

import parkBg from '@/assets/park.png'
import templeBg from '@/assets/temple.png'
import seaBg from '@/assets/sea.jpg'

const scene = ref('park')
const currentBg = computed(() => ({
  park: parkBg,
  temple: templeBg,
  sea: seaBg
}[scene.value]))

/* ===== 人物 ===== */
import boySrc from '@/assets/firstboy.png'
import meSrc from '@/assets/me.png'

const CHAR_W = 80
const CHAR_H = 180

const p1 = ref({ x: 0, y: 0 })
const p2 = ref({ x: 0, y: 0 })

function resetPlayers() {
  const ground = window.innerHeight * 0.65
  p1.value = { x: window.innerWidth * 0.2, y: ground - CHAR_H }
  p2.value = { x: window.innerWidth * 0.55, y: ground - CHAR_H }
}

const styleOf = (p) => ({
  left: p.x + 'px',
  top: p.y + 'px',
  width: CHAR_W + 'px',
  height: CHAR_H + 'px'
})

/* ===== 移動 ===== */
const moveDir = ref(0)
const speed = 4

function loop() {
  if (!showDialog.value && parkVisible.value) {
    p1.value.x += moveDir.value * speed
    p1.value.x = Math.max(0, Math.min(window.innerWidth - CHAR_W, p1.value.x))

    const hit =
      p1.value.x < p2.value.x + CHAR_W &&
      p1.value.x + CHAR_W > p2.value.x

    if (hit) {
      showDialog.value = true
      dialogState.value = scene.value
      moveDir.value = 0
    }
  }
  requestAnimationFrame(loop)
}

/* ===== Dialog 行為 ===== */
function onDialogRight() {
  if (dialogState.value === 'intro') {
    parkVisible.value = true
    showDialog.value = false
    dialogState.value = 'park'
    resetPlayers()
    return
  }

  if (dialogState.value === 'park') scene.value = 'temple'
  else if (dialogState.value === 'temple') scene.value = 'sea'

  showDialog.value = false
  resetPlayers()
}

function onDialogLeft() {
  if (dialogState.value === 'park') {
    dialogState.value = 'exit1'
  }
}

/* ===== 啟動 ===== */
onMounted(() => {
  loop()
})
</script>

<style scoped>
.app {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  position: relative;
}

.bg {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
}

.char {
  position: absolute;
  pointer-events: none;
}

.scene {
  position: fixed;
  inset: 0;
  background-size: cover;
  background-position: center;
}

.character {
  position: absolute;
  bottom: 15%;
  width: 80px;
}

.me {
  left: 50%;
  transform: translateX(-50%);
}

.boy {
  transform: translateX(-50%);
}

</style>
