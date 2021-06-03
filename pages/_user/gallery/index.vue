<template>
  <div id="user-gallery">
    <h1 class="h4">
      Gallery
    </h1>
    <hr>

    <template v-if="loading">
      <Loading />
    </template>

    <template v-else>
      <b-form-group class="text-right">
        <b-form-radio-group
          id="btn-radios-1"
          v-model="viewType"
          :options="viewOptions"
          buttons
          button-variant="outline-secondary"
          name="radios-btn-default"
        />
      </b-form-group>

      <div v-if="series <= 0" class="text-center mt-5">
        <p class="h5">
          No item found!
        </p>
      </div>

      <b-row v-else>
        <b-col v-for="(s,i) of series" :key="i" md="6" xl="4">
          <ContentCard :series="s" route="gallery-collectible" />
        </b-col>
      </b-row>
    </template>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import ContentCard from '@/components/cards/ContentCard.vue'

export default {
  name: 'UserGallery',

  components: {
    ContentCard
  },

  data () {
    return {
      viewType: 'for-sale',
      viewOptions: [
        { text: 'For Sale', value: 'for-sale' },
        { text: 'All', value: 'all' }
      ]
    }
  },

  async fetch () {
    await this.loadOnMarket()
  },

  computed: {
    ...mapGetters('collectible', ['series'])
  },

  watch: {
    async viewType (value) {
      if (value === 'for-sale') { await this.$fetch() }

      if (value === 'all') { await this.fetchAll() }
    }
  },

  methods: {
    ...mapActions('collectible', ['fetchOnMarket', 'fetchAllCollectibles']),

    async loadOnMarket () {
      this.loading = true

      await this.fetchOnMarket({ account: this.$route.params.user })

      this.loading = false
    },

    async fetchAll () {
      this.loading = true

      await this.fetchAllCollectibles(this.$route.params.user)

      this.loading = false
    }
  }
}
</script>

<style>
</style>
