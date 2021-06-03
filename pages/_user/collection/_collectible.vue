<template>
  <div id="collection-series">
    <template v-if="loading">
      <Loading />
    </template>

    <template v-else>
      <div class="mb-3 text-center">
        <client-only>
          <b-img v-if="series.type === 'image'" fluid :src="series.file" />

          <vue-plyr v-else-if="series.type === 'video'">
            <video
              controls
              crossorigin
              playsinline
              loop
              autoplay
            >
              <source :src="series.file">
            </video>
          </vue-plyr>

          <vue-plyr v-else-if="series.type === 'audio'">
            <audio controls crossorigin playsinline autoplay loop>
              <source :src="series.file">
            </audio>
          </vue-plyr>
        </client-only>
      </div>
      <div class="mb-3">
        <h1 class="h3">
          {{ series.title }}
        </h1>

        <h3 class="h6">
          Collection: {{ series.collection_name }}
        </h3>

        <h3 class="h6">
          Total Edition(s): {{ series.editions }}
          <a
            v-if="series.unlockable"
            v-b-popover.hover.topright="
              `This photo has unlockable ${series.unlockable.type}, which can be unlocked from your collection page after purchasing one or more editions of it.`
            "
            title="Unlockable Content"
          >
            <v-icon name="lock" />
          </a>
        </h3>

        <h3 class="h6">
          Category: {{ series.category }}
        </h3>

        <hr>

        <p>{{ series.description }}</p>

        <ul class="list-inline">
          <li v-for="(t, i) of series.tags" :key="i" class="list-inline-item">
            <nuxt-link :to="{ name: 'discover', query: { q: t } }">
              #{{ t }}
            </nuxt-link>
          </li>
        </ul>
      </div>
      <hr>

      <!-- <div v-if="isAuthenticated">
        <UploadUnlockable
          v-if="getCreator === authenticatedUser"
          :max-size="100"
          :series="seriesName"
        />

        <DownloadUnlockable
          v-if="username === authenticatedUser"
          :series="series"
        />
      </div> -->

      <b-button
        :to="{ name: 'user-collection', params: { username } }"
        variant="primary"
        size="sm"
        class="mb-3"
      >
        <v-icon name="chevron-left" />&nbsp; Back
      </b-button>

      <template v-if="computedCollection.length > 0">
        <b-table
          responsive
          striped
          show-empty
          :per-page="perPage"
          :current-page="currentPage"
          :items="computedCollection"
          :fields="fields"
        >
          <template #cell(creator)>
            <nuxt-link
              :to="{ name: 'user-collection', params: { user: getCreator } }"
            >
              {{ getCreator }}
            </nuxt-link>
          </template>
          <template #cell(account)="data">
            <nuxt-link
              :to="{
                name: 'user-collection',
                params: { user: data.item.account },
              }"
            >
              {{ data.item.account }}
            </nuxt-link>
          </template>
          <template #cell(rights)="data">
            {{ rightsOptions[data.item.rights - 1] }}
          </template>

          <template #cell(actions)="{item}">
            <AddToCart
              :nft-id="item.nft_id"
              :series="item.series"
              :name="series.name"
              :image="series.thumbnail"
              :edition="item.edition"
              :collection="computedCollection"
              :owner="item.account"
            />
          </template>
        </b-table>

        <b-pagination
          v-if="computedCollection.length > perPage"
          v-model="currentPage"
          :total-rows="tableRows"
          :per-page="perPage"
          align="center"
        />

        <h2 class="h4 mt-5">
          History
        </h2>
        <hr>

        <p v-if="history.length <= 0" class="text-center">
          No history found!
        </p>

        <ul class="list-unstyled">
          <li v-for="(h, i) of history" :key="i" class="mb-3">
            <SeriesTransactionHistory :transaction="h" />
          </li>
        </ul>
      </template>
    </template>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import AddToCart from '@/components/buttons/AddToCart.vue'
import SeriesTransactionHistory from '@/components/SeriesTransactionHistory.vue'

export default {
  name: 'CollectionSeries',
  components: {
    AddToCart,
    SeriesTransactionHistory
  },

  data () {
    return {
      fields: [
        { key: 'creator', label: 'CREATOR' },
        { key: 'account', label: 'OWNER' },
        { key: 'edition', label: 'EDITION #' },
        { key: 'rights', label: 'RIGHTS' },
        { key: 'actions', label: '' }
      ],
      perPage: 20,
      currentPage: 1,
      rightsOptions: ['Private', 'Limited Production Rights']
    }
  },

  async fetch () {
    this.loading = true

    await Promise.all([
      this.fetchCollection({ account: this.$route.params.user, 'properties.series': this.$route.params.collectible }),
      this.fetchCollectibleHistory(this.$route.params.collectible)
    ])

    this.loading = false
  },

  head () {
    return {
      title: this.series.name,
      meta: [
        { hid: 'description', name: 'description', content: this.series.description },
        { hid: 'og-type', property: 'og:type', content: 'website' },
        { hid: 'og-title', property: 'og:title', content: this.series.name },
        { hid: 'og-image', property: 'og:image', content: this.series.thumbnail },
        { hid: 'og-description', property: 'og:description', content: this.series.description },

        { hid: 'twitter-card', name: 'twitter:card', content: 'summary_large_image' },
        { hid: 'twitter-title', name: 'twitter:title', content: this.series.name },
        { hid: 'twitter-description', name: 'twitter:description', content: this.series.description },
        { hid: 'twitter-image', name: 'twitter:image', content: this.series.thumbnail }
      ]
    }
  },

  computed: {
    ...mapGetters('user', ['isAuthenticated', 'username']),
    ...mapGetters('collectible', ['series', 'collection']),
    ...mapGetters('market', ['history']),

    computedCollection () {
      let { collection } = this

      collection = collection.map((c) => {
        const metadata = JSON.parse(c.metadata)

        return {
          ...c,
          series: c.series,
          edition: c.edition,
          ...metadata
        }
      })

      return collection
    },

    getCreator () {
      const [creator] = this.$route.params.collectible.split('_')

      return creator
    },

    tableRows () {
      return this.computedCollection.length
    }
  },

  mounted () {
    const self = this

    this.$eventBus.$on([
      'nft-transfer-successful',
      'nft-sell-successful',
      'nft-burn-successful',
      'unlockable-uploaded'
    ], async () => {
      self.loading = true

      await self.sleep(10 * 1000)

      await self.$fetch()
    })
  },

  beforeDestroy () {
    this.$eventBus.$off([
      'nft-transfer-successful',
      'nft-sell-successful',
      'nft-burn-successful',
      'unlockable-uploaded'
    ])
  },

  methods: {
    ...mapActions('collectible', ['fetchCollection']),
    ...mapActions('market', ['fetchCollectibleHistory'])
  }
}
</script>

<style>
</style>
