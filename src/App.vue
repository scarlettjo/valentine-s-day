<template>
  <div class="app">
    <!-- 背景 -->
    <div class="scene" :style="{ backgroundImage: `url(${currentBg})` }"></div>

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
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import DialogBox from './DialogBox.vue'
import Controls from './Controls.vue'

/* ===== 狀態 ===== */
// 進站不要 Intro：直接 park + 人物 + 控制
const dialogState = ref('park')
const showDialog = ref(false)
const parkVisible = ref(true)

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

const dialogText = computed(() => DIALOG_TEXT[dialogState.value] ?? '')

/* ===== 背景 ===== */
import parkBg from '@/assets/park.jpg'
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
  const h = window.visualViewport?.height || window.innerHeight
  const ground = h * 0.97 // 更往下
  const y = Math.min(ground - CHAR_H, h - CHAR_H - 8)

  p1.value = { x: window.innerWidth * 0.2,  y }
  p2.value = { x: window.innerWidth * 0.55, y }
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
    scene.value = 'park'
    dialogState.value = 'park'
    resetPlayers()
    return
  }

  if (dialogState.value === 'park') {
    scene.value = 'temple'
    dialogState.value = 'temple'
  } else if (dialogState.value === 'temple') {
    scene.value = 'sea'
    dialogState.value = 'sea'
  } else if (dialogState.value === 'sea') {
    dialogState.value = 'exit1'
  }

  showDialog.value = false
  resetPlayers()
}

function onDialogLeft() {
  if (dialogState.value === 'park') dialogState.value = 'exit1'
}

/* ===== 鍵盤（桌機用） ===== */
function onKeyDown(e) {
  if (showDialog.value || !parkVisible.value) return
  if (e.key === 'ArrowLeft') moveDir.value = -1
  if (e.key === 'ArrowRight') moveDir.value = 1
}
function onKeyUp(e) {
  if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') moveDir.value = 0
}

onMounted(() => {
  resetPlayers()
  loop()
  window.addEventListener('keydown', onKeyDown)
  window.addEventListener('keyup', onKeyUp)
})
onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeyDown)
  window.removeEventListener('keyup', onKeyUp)
})
</script>

<style scoped>
.app{
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  position: relative;
}

/* 背景只顯示，不吃點擊 */
.scene{
  position: fixed;
  inset: 0;
  background-size: cover;
  background-position: center;
  pointer-events: none;
  z-index: 0;
}

.char{
  position: absolute;
  pointer-events: none;
  z-index: 10;
}
</style>
