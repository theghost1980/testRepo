<template>
  <div class="content-card" :style="css">
    <div v-if="showWarning" class="nsfw" :style="css" @click.prevent="toggle">
      NSFW - Click to reveal
    </div>

    <template v-if="showImage">
      <AudioHover v-if="getFileType(file) === 'audio'" :source="file" :poster="thumbnail" class="collectible-image" />

      <VideoHover v-else-if="getFileType(thumbnail) === 'video'" :source="thumbnail" class="collectible-image" />

      <div v-else-if="getFileType(thumbnail) === 'image'" v-lazy:background-image="thumbnail" class="collectible-image" />
    </template>
  </div>
</template>

<script>
import AudioHover from '@/components/AudioHover.vue'
import VideoHover from '@/components/VideoHover.vue'

export default {
  name: 'ContentCardSmall',

  components: {
    AudioHover,
    VideoHover
  },

  props: {
    thumbnail: { type: String, required: true },
    file: { type: String, required: true },
    css: { type: String, default: 'width:100px; height:100px; line-height:100px' }
  },

  data () {
    return {
      showWarning: false,
      showImage: true
    }
  },

  created () {
    this.nsfwPref = this.$cookies.get('nsfw_pref') || 'warn'

    if (this.nsfwPref === 'warn' && this.nsfw) {
      this.showWarning = true
      this.showImage = false
    }
  },

  methods: {
    toggle () {
      this.showWarning = !(this.showWarning)
      this.showImage = !(this.showImage)
    },

    getFileType (url) {
      const ext = url.toLowerCase().split('.').pop()

      const exts = {
        png: 'image',
        jpg: 'image',
        jpeg: 'image',
        gif: 'image',
        mp4: 'video',
        webm: 'video',
        mp3: 'audio',
        mpga: 'audio',
        wav: 'audio'
      }

      return exts[ext]
    }
  }
}
</script>

<style>
</style>
