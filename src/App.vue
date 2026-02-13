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
const dialogState = ref('intro')
const showDialog = ref(true)
const parkVisible = ref(false)
console.log('app start')

const DIALOG_TEXT = {
  intro: `嗨!周小寶,今天是難得的情人節,
我想說給你一個驚喜，順邊發揮所長(?)
這是一個年度Spotlight的小遊戲，希望你會喜歡!

前陣子花了點時間在用電腦,
就是因為這個喔!希望你不要擔心~
(雖然因為大吵破梗了哈哈哈)

點擊關閉!`,
  park: `看的出來背景圖是瓶蓋公園嗎?這是我們的起點!
        雖然當天嚇死我了，我覺得好突然所以緊張到把自己扭成一團。
        在告白前我其實也幾度思考是否有開始的必要，
        因為你剛好要當兵，我又很黏人，
        我知道你的喜歡來自於真誠，我也試圖去信賴你對我的喜歡，
        我一邊覺得當時的你心智不夠成熟，又覺得幼稚的很可愛。
        
        後來我轉念一想，愛情就是不能猶豫!!!

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
        被不喜歡情侶的神明放過一馬的感覺就是這樣嗎
        嘻嘻><

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

  tainan: `我覺得台南是個很適合我們去玩的地方，
        因為台南有很多好吃的東西，還有很多小店可以去逛，上次來不及在漁光島一起看日落真的好可惜，
        
        我們還會有下次嗎?

        老實說從台南結束後我們就經常吵架，
        我經常在想是哪個環節開始出錯的呢?
        我覺得吵架也是一種相處的方式，
        我們可以藉由爆發點來釐清彼此的想法，然後再繼續前進，
        我也知道有時候吵架會讓人很難受，
        但因為我愛你，所以我甘願去磨合，去理解，去包容，去成長，
        我也相信我們的感情是值得的，因為我們有很多美好的回憶，
        我們對生活上的品質規劃也一致，

        可是我開始感受到你對我的愛逐漸減少，這是好傷人的一件事實，
        就像第一個對話框所說的，我原本很信賴你對我的喜歡，
        這是我願意磨合的原因，我知道我們年紀還小、思想上都還可以更精進，
        可是如果我們的愛有時差，我不知道怎麼跟你回到軌道上，
        你很常說我可以找到更適合我的人，
        我知道這句話是因為你覺得自己可以找到更適合你的人。

        我知道我一定也有感情上的缺點，沒有人是上帝視角、沒有人是完美的，
        可是在還沒正式分開的狀況下你開始幻想跟別人在一起，對我來說就是精神出軌了。

        可是我喜歡你，我想要你能體會生命中所有美好溫潤的事情，我期待我能陪你一起去迎接未來，
        我愈來愈沒有把握是否能做到這點，或許我收起一些自己的愛，只用20%的愛來愛你，
        或許你會更看好這段關係，可是這真的是你跟我想要的嗎?

        現在的我更不想去思考我們的未來了，我想要好好珍惜跟你相處的日子，
        我會繼續好好愛你，珍惜你，陪伴你，支持你，理解你，包容你，成長你，
        但如果你還是會對我挑剔甚微，我想我也會接受你的離開。

        這一年來是我人生中少數踏實平穩的日子，我還是很感謝你曾經給過我的愛，
        不做選擇也是一種選擇，從交往的那天起我就在倒數你哪天會失去對我的熱忱，
        這次只不過是比我想像中的快而已。
        這是我們的大難關，我想要我們能一起修復，你這陣子的改變我是有感受到的，
        我也有在努力，但我們也需要時間和不停的溝通對吧?


        我愛你，所以我不會拘束你，希望哪天你能明白我的心意，
        情人節快樂，周小寶。
`,
  exit1: `恭喜你獲得被榨乾機會乙次`
}

const dialogText = computed(() => DIALOG_TEXT[dialogState.value] ?? '')

/* ===== 背景 ===== */
import parkBg from '@/assets/park.jpg'
import templeBg from '@/assets/temple.png'
import seaBg from '@/assets/sea.jpg'
import korenBg from '@/assets/koren.jpg'
import tainanBg from '@/assets/tainan.jpg'

const scene = ref('park')
const currentBg = computed(() => ({
  park: parkBg,
  temple: templeBg,
  sea: seaBg,
  koren: korenBg,
  tainan: tainanBg
}[scene.value]))

/* ===== 人物 ===== */
import boySrc from '@/assets/firstboy.png'
import meSrc from '@/assets/me.png'

const CHAR_W = 80
const CHAR_H = 180

const p1 = ref({ x: 0, y: 0 })
const p2 = ref({ x: 0, y: 0 })

function resetPlayers() {
  const y = window.innerHeight - CHAR_H - 20
  p1.value = { x: window.innerWidth * 0.1, y }
   p2.value = { 
    x: (window.innerWidth - CHAR_W) / 2,  // 正中間
    y 
  }
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
const canTriggerHit = ref(true)
function loop() {
  if (!showDialog.value && parkVisible.value) {
    p1.value.x += moveDir.value * speed
    p1.value.x = Math.max(0, Math.min(window.innerWidth - CHAR_W, p1.value.x))

    const hit =
      p1.value.x < p2.value.x + CHAR_W &&
      p1.value.x + CHAR_W > p2.value.x

    if (hit && canTriggerHit.value) {
  showDialog.value = true
  dialogState.value = scene.value
  moveDir.value = 0
  canTriggerHit.value = false
}
  }
  requestAnimationFrame(loop)
}

/* ===== Dialog 行為 ===== */
function onDialogRight() {

  if (dialogState.value === 'intro') {
    parkVisible.value = true
    showDialog.value = false
    resetPlayers()
    return
  }

  showDialog.value = false
  resetPlayers()

  setTimeout(() => {
    canTriggerHit.value = true
  }, 500)

  if (dialogState.value === 'park') {
    scene.value = 'temple'
    dialogState.value = 'temple'
  } else if (dialogState.value === 'temple') {
    scene.value = 'sea'
    dialogState.value = 'sea'
  } else if (dialogState.value === 'sea') {
    scene.value = 'koren'
    dialogState.value = 'koren'
  } else if (dialogState.value === 'koren') {
    scene.value = 'tainan'
    dialogState.value = 'tainan'


  } else if (dialogState.value === 'tainan') {
    dialogState.value = 'exit1'
  }
}


function onDialogLeft() {
  dialogState.value = 'exit1'
}


// function onKeyUp(e) {
//   if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') moveDir.value = 0
// }

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

})
onBeforeUnmount(() => {

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
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center bottom;
}
.char{
  position: absolute;
  pointer-events: none;
  z-index: 10;
}

</style>
