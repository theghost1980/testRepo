<template>
  <div v-lazy:background-image="poster">
    <audio
      style="display: block; height: 100%; width: 100%"
      :controls="controls"
      :muted="muted"
      loop
      @mouseover="audioElementMouseHover($event)"
      @mouseout="audioElementMouseOut($event)"
      @touchstart="audioElementTouchStart($event)"
      @touchend="audioElementTouchEnd($event)"
    >
      <source :src="source">
    </audio>
  </div>
</template>

<script>
export default {
  name: 'AudioHover',

  props: {
    source: {
      type: String,
      default: ''
    },

    poster: {
      type: String,
      default: ''
    },

    type: {
      type: String,
      default: 'audio/mpeg'
    },

    muted: {
      type: Boolean,
      default: false
    },

    controls: {
      type: Boolean,
      default: false
    }
  },

  methods: {
    audioElementMouseHover (event) {
      event.target.play()
    },

    audioElementMouseOut (event) {
      event.target.pause()
    },

    audioElementTouchStart (event) {
      event.target.play()
    },

    audioElementTouchEnd (event) {
      event.target.pause()
    }
  }
}
</script>
