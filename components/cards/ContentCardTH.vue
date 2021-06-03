<template>
  <div class="collectible-card" @click="$router.push({name: route, params: {collectible: data.series}})">
    <div v-if="data.video" class="video-icon">
      <v-icon name="video" />
    </div>

    <div v-if="showWarning" class="nsfw" @click.prevent="toggle">
      NSFW - Click to reveal
    </div>

    <template v-if="showImage">
      <AudioHover v-if="getFileType(data.file) === 'audio'" :source="data.file" :poster="data.thumbnail" class="collectible-image" />

      <VideoHover v-else-if="getFileType(data.thumbnail) === 'video'" :source="data.thumbnail" class="collectible-image" />

      <div v-else-if="getFileType(data.thumbnail) === 'image'" v-lazy:background-image="data.thumbnail" class="collectible-image" />
    </template>

    <nuxt-link :to="{name: route, params: {collectible: data.series}}" class="collectible-name text-center d-block h3">
      {{ data.name }}
    </nuxt-link>

    <b-row class="collectible-info">
      <b-col>
        <span class="text-muted">
          Buyer
          <br>
          <nuxt-link :to="`/${data.buyer}/collection`">{{ data.buyer }}</nuxt-link>
        </span>
      </b-col>
      <b-col class="text-right">
        <span class="text-muted">
          Seller
          <br>
          <nuxt-link :to="`/${data.seller}/gallery`">{{ data.seller }}</nuxt-link>
        </span>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import AudioHover from '@/components/AudioHover.vue'
import VideoHover from '@/components/VideoHover.vue'

export default {
  name: 'ContentCardHistory',

  components: {
    AudioHover,
    VideoHover
  },

  props: {
    data: { type: Object, required: true },
    route: { type: String, required: true }
  },

  data () {
    return {
      showWarning: false,
      showImage: true
    }
  },

  created () {
    this.nsfwPref = this.$cookies.get('nsfw_pref') || 'warn'

    if (this.nsfwPref === 'warn' && this.data.nsfw) {
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
