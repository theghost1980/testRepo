<template>
  <video
    :controls="controls"
    :muted="muted"
    preload="metadata"
    loop
    @mouseover="videoElementMouseHover($event)"
    @mouseout="videoElementMouseOut($event)"
    @touchstart="videoElementTouchStart($event)"
    @touchend="videoElementTouchEnd($event)"
  >
    <source :src="`${source}#t=0.1`">
  </video>
</template>

<script>
export default {
  name: 'VideoHover',

  props: {
    source: {
      type: String,
      default: ''
    },

    type: {
      type: String,
      default: 'video/mp4'
    },

    muted: {
      type: Boolean,
      default: true
    },

    controls: {
      type: Boolean,
      default: false
    }
  },

  methods: {
    videoElementMouseHover (event) {
      event.target.play()
    },

    videoElementMouseOut (event) {
      event.target.pause()
    },

    videoElementTouchStart (event) {
      event.target.play()
    },

    videoElementTouchEnd (event) {
      event.target.pause()
    }
  }
}
</script>
