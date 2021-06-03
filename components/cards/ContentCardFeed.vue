<template>
  <div class="collectible-card-feed">
    <div class="row">
      <div class="col-md-4 mb-2">
        <nuxt-link :to="{name: 'gallery-collectible', params: {collectible: data.series}}">
          <div v-if="data.type === 'audio'" class="file-type-icon">
            <v-icon name="music" />
          </div>

          <div v-if="data.type === 'video'" class="file-type-icon">
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
        </nuxt-link>
      </div>

      <div class="col-md-8 mb-2">
        <b-row>
          <b-col cols="3" sm="2" md="3" lg="2">
            <b-avatar
              variant="light"
              crossorigin
              :src="`${$config.API_BASE_URL}/avatar/${data.creator}`"
              class="border mt-2"
              size="3rem"
            />
          </b-col>

          <b-col cols="9" sm="10" md="9" lg="10">
            <nuxt-link :to="`/${data.creator}/gallery`">
              @{{ data.creator }}
            </nuxt-link>
            tokenized {{ data.editions }} {{ data.editions > 1 ? 'editions':'edition' }} of
            <nuxt-link
              :to="{name: 'gallery-collectible', params: {collectible: data.series}}"
            >
              {{ data.name }}
            </nuxt-link>

            <p>
              <timeago class="text-muted" :datetime="new Date(data.created_at)" :auto-update="60" />
            </p>
          </b-col>
        </b-row>
      </div>
    </div>
  </div>
</template>

<script>
import AudioHover from '@/components/AudioHover.vue'
import VideoHover from '@/components/VideoHover.vue'

export default {
  name: 'ContentCardFeed',

  components: {
    AudioHover,
    VideoHover
  },

  props: {
    data: { type: Object, required: true }
  },

  data () {
    return {
      showWarning: false,
      showImage: true,
      nsfwPref: 'warn'
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
