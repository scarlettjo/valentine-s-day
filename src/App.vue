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
    <div class="debug-bar">CONTROLS</div>
    <!-- 控制鍵 -->
    <Controls
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
const dialogState = ref('intro')
const showDialog = ref(true)
const parkVisible = ref(false)


const DIALOG_TEXT = {
  intro: `嗨!周小寶,今天是難得的情人節,
我想說給你一個驚喜，順邊發揮所長(?)

前陣子花了點時間在用電腦,
就是因為這個喔!希望你不要擔心~
(雖然因為大吵破梗了哈哈哈)

點擊關閉!`,
  park: `雖然當天嚇死我了，我覺得好突然所以緊張到把自己扭成一團
        當時其實想了很久，因為你剛好要當兵，我又很黏人,
        可是我又覺得愛情就是不能猶豫!!!33
        如果我們遇見彼此時沒有握緊雙方的手，那我們就會走散了
        所以過了幾天就找機會跟寶寶說我的想法了
        (雖然周小寶本人很心機說想看我寫的字)


        再點一次右下角!
        !`,
  temple: `這邊是我們第一次去台中後回來的地方!
        那個時候好像沒算好時間，太晚回來
        然後我們就跑去洪爐地拜拜???
        前陣子才知道呂洞賓不喜歡情侶，會故意拆散
        可是我們還是交往了一年多!
        被不喜歡情侶的神明放過一馬的感覺就是這樣嗎><
        我記得我跟你在一起前，也去了台中拜月老
        當時抽到了上上籤，說我會遇到非~常適合我的人
        我想就是周小寶吧!'`,
  sea: `第一次見你朋友是去年的228露營
        回程的時候去了漂亮的海邊
        不知道是誤打誤撞還是周宏澤細心規劃
        但到現在還是覺得愛心入口很浪漫
        現在想想當時應該多拍一點合照
        可惜周小寶當時沒有頭髮嘻嘻
        那幾天只有瘋狂瑟瑟


        呀哈`,
  koren: `去年五月是我們第一次去韓國!!
        那幾天真的好開心，雖然行程有點趕
        但我覺得很充實，因為我們去了很多地方
        最喜歡的是吃章魚!!回來後都念念不忘 吃芥末章魚解饞XD

        還有寶寶準備的生日餐
        那個杯子真的是太可愛了...!!
        可惜當天也因為太趕,身體吃不消後來都吐出來
        (超級難過)
        但下次我們預留休息時間就不會有這個問題了!!

        現在想想又好想跟寶寶出國喔><`,
  exit1: `恭喜你獲得被榨乾機會乙次`
}

const dialogText = computed(() => DIALOG_TEXT[dialogState.value] ?? '')

/* ===== 背景 ===== */
import parkBg from '@/assets/park.jpg'
import templeBg from '@/assets/temple.png'
import seaBg from '@/assets/sea.jpg'
import korenBg from '@/assets/koren.jpg'

const scene = ref('park')
const currentBg = computed(() => ({
  park: parkBg,
  temple: templeBg,
  sea: seaBg,
  koren: korenBg
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
  } else if (dialogState.value === 'koren') {
    scene.value = 'koren'
    dialogState.value = 'koren'
  } else if (dialogState.value === 'sea') {
    dialogState.value = 'exit1'
  }

  showDialog.value = false
  resetPlayers()
}

function onDialogLeft() {
  dialogState.value = 'exit1'
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

function preload(url) {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = resolve
    img.onerror = resolve
    img.src = url
  })
}

onMounted(async () => {
  await preload(currentBg.value)
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
.debug-bar{
  position: fixed;
  top: 10px;
  left: 10px;
  z-index: 2147483647;
  background: #f2a7c6;
  color: #fff;
  padding: 6px 10px;
  border-radius: 999px;
  font-weight: 800;
  font-size: 12px;
}
</style>
