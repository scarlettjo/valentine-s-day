export default {
  props: ['text', 'state'],
  emits: ['close', 'next'],

  template: `
  <div class="dialog bounce">
    <div class="dialog-content">{{ text }}</div>

    <div class="dialog-actions">
      <button
        v-if="state !== 'intro'"
        @click="$emit('next', 'exit1')"
      >
        你想按這個？
      </button>

      <button @click="$emit('close')">關閉</button>
    </div>
  </div>
  `
};
