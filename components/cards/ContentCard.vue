<template>
  <div class="collectible-card" @click="$router.push({name: route, params: {collectible: series.series}})">
    <div v-if="series.type === 'audio'" class="file-type-icon">
      <v-icon name="music" />
    </div>

    <div v-if="series.type === 'video'" class="file-type-icon">
      <v-icon name="video" />
    </div>

    <div v-if="showWarning" class="nsfw" @click.prevent="toggle">
      NSFW - Click to reveal
    </div>

    <template v-if="showImage">
      <AudioHover v-if="getFileType(series.file) === 'audio'" :source="series.file" :poster="series.thumbnail" class="collectible-image" />

      <VideoHover v-else-if="getFileType(series.thumbnail) === 'video'" :source="series.thumbnail" class="collectible-image" />

      <div v-else-if="getFileType(series.thumbnail) === 'image'" v-lazy:background-image="series.thumbnail" class="collectible-image" />
    </template>

    <nuxt-link :to="{name: route, params: {collectible: series.series}}" class="collectible-name d-block h3" :class="{'text-center': type === 'featured'}">
      {{ series.name }}
    </nuxt-link>

    <p v-if="type === 'featured'" class="collectible-artist">
      by
      <nuxt-link :to="`/${series.creator}/gallery`">
        @{{ series.creator }}
      </nuxt-link>
    </p>
  </div>
</template>

<script>
import AudioHover from '@/components/AudioHover.vue'
import VideoHover from '@/components/VideoHover.vue'

export default {
  name: 'ContentCard',

  components: {
    AudioHover,
    VideoHover
  },

  props: {
    series: { type: Object, required: true },
    route: { type: String, required: true },
    count: { type: Number, default: 0 },
    type: { type: String, default: 'default' }
  },

  data () {
    return {
      showWarning: false,
      showImage: true
    }
  },

  created () {
    this.nsfwPref = this.$cookies.get('nsfw_pref') || 'warn'

    if (this.nsfwPref === 'warn' && this.series.nsfw) {
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
