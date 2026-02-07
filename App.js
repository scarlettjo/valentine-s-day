const { createApp, ref } = Vue;

import DialogBox from './DialogBox.js';
import Controls from './Controls.js';

createApp({
  components: { DialogBox, Controls },

  setup() {
    const dialogState = ref('intro');
    const showDialog = ref(true);

    const bgImage = ref('./park.png');

    const p1X = ref(20);
    const moveDir = ref(0);

    const dialogTextMap = {
      intro: `嗨!周小寶,今天是難得的情人節
我想說給你一個驚喜～

點擊關閉吧!`,
      park: `這是瓶蓋公園
再點一次吧!`,
      temple: `洪爐地那次還記得嗎`,
      sea: `228 那次的海邊`,
      exit1: `恭喜你獲得被榨乾機會乙次`
    };

    setInterval(() => {
      p1X.value += moveDir.value * 1.5;
      p1X.value = Math.max(0, Math.min(80, p1X.value));
    }, 16);

    function handleClose() {
      showDialog.value = false;
    }

    function handleBounceNext(next) {
      showDialog.value = false;
      setTimeout(() => {
        dialogState.value = next;
        showDialog.value = true;
      }, 120);
    }

    return {
      dialogState,
      showDialog,
      dialogTextMap,
      bgImage,
      p1X,
      moveDir,
      handleClose,
      handleBounceNext
    };
  },

  template: `
  <div class="scene" :style="{ backgroundImage: 'url(' + bgImage + ')' }"></div>

  <img src="./firstboy.png" class="character boy" :style="{ left: p1X + '%' }" />
  <img src="./me.png" class="character me" />

  <DialogBox
    v-if="showDialog"
    :text="dialogTextMap[dialogState]"
    :state="dialogState"
    @close="handleClose"
    @next="handleBounceNext"
  />

  <Controls
    v-if="!showDialog"
    @move="dir => moveDir = dir"
  />
  `
}).mount('#app');
