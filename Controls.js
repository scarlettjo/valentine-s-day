export default {
  emits: ['move'],
  template: `
  <div class="controls">
    <button
      class="ctrl-btn"
      @touchstart="$emit('move', -1)"
      @touchend="$emit('move', 0)"
    >◀</button>

    <button
      class="ctrl-btn"
      @touchstart="$emit('move', 1)"
      @touchend="$emit('move', 0)"
    >▶</button>
  </div>
  `
};
