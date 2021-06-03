<template>
  <div id="gallery-series">
    <template v-if="loading">
      <Loading />
    </template>

    <template v-else>
      <h1 class="h3">
        {{ series.name }}
      </h1>
      <hr>
      <b-row>
        <b-col md="5" order="2" order-md="1" class="mb-3">
          <p class="description">
            {{ series.description }}
          </p>
          <p class="text-muted mb-0">
            <strong>Collection:</strong>
            {{ series.collection_name }}
          </p>
          <p class="text-muted mb-0">
            <strong>Creator:</strong>&nbsp;
            <nuxt-link :to="{ name: 'user-gallery', params: { user: getCreator } }">
              @{{ getCreator }}
            </nuxt-link>
            <VerifiedBadge :user="series.artist" />

            <FollowButton
              :user="getCreator"
              size="sm"
              variant="outline-primary"
            />
          </p>
          <p class="text-muted">
            <strong>Total Edition(s):</strong>
            &nbsp;
            {{ series.editions }}
            <a
              v-if="series.unlockable"
              v-b-popover.hover.topright="
                `This photo has unlockable ${series.unlockable.type}, which can be unlocked from your collection page after purchasing one or more editions of it.`
              "
              title="Unlockable Content"
            >
              <v-icon name="lock" />
            </a>
          </p>

          <p class="text-muted">
            <strong>Category:</strong> {{ series.category }}
          </p>

          <ul class="list-inline">
            <li v-for="(t, i) of series.tags" :key="i" class="list-inline-item">
              <nuxt-link :to="{ name: 'discover', query: { q: t } }">
                #{{ t }}
              </nuxt-link>
            </li>
          </ul>
        </b-col>

        <b-col md="7" order="1" order-md="2" class="mb-3">
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
        </b-col>
      </b-row>

      <b-button
        variant="warning"
        size="sm"
        @click.prevent="$bvModal.show('reportCollectibleModal')"
      >
        Report
      </b-button>

      <ReportModal :series="$route.params.collectible" />

      <template v-if="computedMarket.length > 0">
        <b-table
          responsive
          striped
          show-empty
          :per-page="perPage"
          :current-page="currentPage"
          :items="computedMarket"
          :fields="fields"
          sort-by="price"
          class="mt-5"
        >
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

          <template #cell(price)="data">
            {{ data.item.price }} {{ data.item.symbol }}
            <span class="text-muted">({{ getUSDPrice(data.item.price) }})</span>
          </template>

          <template #cell(actions)="{item}">
            <AddToCart
              :nft-id="item.nft_id"
              :series="item.series"
              :name="series.name"
              :image="series.thumbnail"
              :edition="item.edition"
              :collection="computedMarket"
              :price="item.price"
              :owner="item.account"
              :on-market="true"
            />
          </template>
        </b-table>

        <b-pagination
          v-if="computedMarket.length > perPage"
          v-model="currentPage"
          :total-rows="tableRows"
          :per-page="perPage"
          align="center"
        />
      </template>

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
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import AddToCart from '@/components/buttons/AddToCart.vue'
import FollowButton from '@/components/buttons/FollowButton.vue'
import ReportModal from '@/components/modals/ReportModal.vue'
import SeriesTransactionHistory from '@/components/SeriesTransactionHistory.vue'
import VerifiedBadge from '@/components/badges/VerifiedBadge.vue'

export default {
  name: 'MarketSeries',

  components: {
    AddToCart,
    FollowButton,
    ReportModal,
    SeriesTransactionHistory,
    VerifiedBadge
  },

  data () {
    return {
      dataLoaded: false,
      fields: [
        { key: 'account', label: 'OWNER' },
        { key: 'edition', label: 'EDITION #' },
        { key: 'rights', label: 'RIGHTS' },
        { key: 'price', label: 'PRICE', sortable: true },
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
      this.fetchMarket({ 'grouping.series': this.$route.params.collectible }),
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
    ...mapGetters(['hive_price']),
    ...mapGetters('user', ['username']),
    ...mapGetters('market', ['series', 'market', 'nfts', 'history']),

    getCreator () {
      const [creator] = this.$route.params.collectible.split('_')

      return creator
    },

    computedMarket () {
      const self = this

      return this.market.map((m) => {
        const nft = self.nfts.find(n => n.nft_id === m.nft_id)

        if (nft) {
          const { edition, metadata } = nft

          return {
            ...m,
            edition,
            ...JSON.parse(metadata)
          }
        }

        return {
          ...m
        }
      })
    },

    tableRows () {
      return this.computedMarket.length
    }
  },

  mounted () {
    const self = this

    this.$eventBus.$on('nft-buy-successful', async () => {
      self.loading = true

      await self.sleep(10 * 1000)

      await self.$fetch()
    })
  },

  beforeDestroy () {
    this.$eventBus.$off('nft-buy-successful')
  },

  methods: {
    ...mapActions('market', ['fetchMarket', 'fetchCollectibleHistory']),

    getUSDPrice (hivePrice) {
      return `$${Number(Number(hivePrice) * this.hive_price).toFixed(3)}`
    }
  }
}
</script>

<style>
</style>
