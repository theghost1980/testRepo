<template>
  <div id="market">
    <h1 class="h3 text-uppercase text-center">
      Gallery
    </h1>

    <template v-if="loading">
      <Loading />
    </template>

    <template v-else>
      <b-form-row class="mt-5">
        <b-col sm="12" md="4" lg="4">
          <b-form-group label="Price">
            <b-row no-gutters>
              <b-col cols="4">
                <b-form-input
                  v-model="minPrice"
                  type="number"
                  placeholder="Min"
                  trim
                />
              </b-col>
              <b-col cols="4" class="pl-1">
                <b-form-input
                  v-model="maxPrice"
                  type="number"
                  placeholder="Max"
                  trim
                />
              </b-col>
              <b-col cols="4" class="pl-1">
                <b-button block variant="primary" @click="filterByPrice">
                  Filter
                </b-button>
              </b-col>
            </b-row>
          </b-form-group>
        </b-col>

        <b-col sm="4" md="3">
          <b-form-group label="Category">
            <b-form-select
              v-model="filterByCategory"
              :options="categoryOptions"
            />
          </b-form-group>
        </b-col>

        <b-col sm="4" md="3">
          <b-form-group label="Rights">
            <b-form-select v-model="filterByRights" :options="rightsOptions" />
          </b-form-group>
        </b-col>

        <b-col sm="4" md="2">
          <b-form-group label="Sort By">
            <b-form-select v-model="sortBy" :options="sortOptions" />
          </b-form-group>
        </b-col>
      </b-form-row>

      <div v-if="interests.length <= 0" class="text-center">
        <p class="h4 mt-5 mb-5">
          No items found!
        </p>
      </div>

      <div v-else>
        <b-row>
          <b-col v-for="(int, i) of interests" :key="i" md="6" lg="4">
            <ContentCard :series="int" route="gallery-collectible" />
          </b-col>
        </b-row>
      </div>
    </template>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from 'vuex'
import ContentCard from '@/components/cards/ContentCard.vue'

export default {
  name: 'Gallery',

  components: {
    ContentCard
  },

  data () {
    return {
      dataLoaded: false,
      sortBy: 'newest',
      sortOptions: [
        { text: 'Newest', value: 'newest' },
        { text: 'Oldest', value: 'oldest' },
        { text: 'Lowest Price', value: 'price_asc' },
        { text: 'Highest Price', value: 'price_desc' },
        { text: 'Recently Updated', value: 'updated' }
      ],
      filterByRights: null,
      rightsOptions: [
        { value: null, text: 'Any Rights' },
        { value: 1, text: 'Private' },
        // { value: 2, text: 'Royalty' },
        { value: 3, text: 'Full Commercial' }
      ],
      filterByCategory: null,
      minPrice: '',
      maxPrice: ''
    }
  },

  async fetch () {
    await this.loadMarket()
  },

  computed: {
    ...mapGetters(['settings']),
    ...mapGetters('market', ['interests', 'pagination']),

    categoryOptions () {
      return [{ value: null, text: 'Select a category' }, ...this.settings.categories]
    }
  },

  watch: {
    async sortBy (value) {
      this.SET_PAGINATION({
        page: 0,
        sort_by: value,
        rights: this.filterByRights,
        category: this.filterByCategory,
        has_more: true
      })

      await this.loadMarket()
    },

    async filterByRights (value) {
      this.SET_PAGINATION({
        page: 0,
        rights: value,
        category: this.filterByCategory,
        sort_by: this.sortBy,
        has_more: true
      })

      await this.loadMarket()
    },

    async filterByCategory (value) {
      this.SET_PAGINATION({
        page: 0,
        rights: this.filterByRights,
        category: value,
        sort_by: this.sortBy,
        has_more: true
      })

      await this.loadMarket()
    }
  },

  created () {
    if (this.pagination.sort_by) { this.sortBy = this.pagination.sort_by }
    if (this.pagination.rights) { this.filterByRights = this.pagination.rights }
    if (this.pagination.category) { this.filterByCategory = this.pagination.category }
  },

  mounted () {
    this.scroll()
  },

  beforeDestroy () {
    this.SET_PAGINATION({ page: 0, has_more: true, price_min: '', price_max: '' })

    window.onscroll = () => {}
  },

  methods: {
    ...mapActions('market', ['fetchInterests']),
    ...mapMutations('market', ['SET_PAGINATION']),

    async loadMarket () {
      this.loading = true

      await this.fetchInterests()

      this.loading = false
    },

    async filterByPrice () {
      this.SET_PAGINATION({ page: 0, has_more: true, price_min: this.minPrice, price_max: this.maxPrice })

      await this.loadMarket()
    },

    scroll () {
      if (!process.client || this.loading) { return }

      window.onscroll = async () => {
        const bottomOfWindow = Math.max(window.pageYOffset, document.documentElement.scrollTop, document.body.scrollTop) + window.innerHeight === document.documentElement.offsetHeight

        if (bottomOfWindow) {
          await this.fetchInterests(true)
        }
      }
    }
  }
}
</script>

<style>
</style>
