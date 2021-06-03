<template>
  <div id="discover" class="thirdFont whitishColor">
    <h1 class="h3 text-uppercase text-center">
      Discover
    </h1>

    <div class="search-form">
      <label ref="label" for="search-input" class="search-label">Search...</label>
      <input
        id="search-input"
        ref="input"
        v-model="searchQuery"
        type="text"
        name="q"
        class="search-input"
        autocomplete="off"
        @focus="searchActive"
        @blur="searchBlured"
        @keyup.enter="search"
      >
      <hr ref="divider" class="divider m-0 p-0">
    </div>

    <div class="search-results">
      <template v-if="loading && searching">
        <Loading />
      </template>

      <template v-if="!loading && !searching">
        <p
          v-if="search_results.length <= 0 && resultsFor.length > 0"
          class="text-center text-muted font-weight-bold"
        >
          No matching results found!
        </p>

        <b-row v-if="search_results.length > 0">
          <b-col cols="12" class="mt-3 mb-3">
            <p
              class="text-muted font-weight-bold"
            >
              {{ search_results.length }} results for "{{ resultsFor }}"
            </p>
          </b-col>

          <b-col v-for="(series,i) in search_results" :key="i" md="4">
            <ContentCard :series="series" route="gallery-collectible" />
          </b-col>
        </b-row>
      </template>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import ContentCard from '@/components/cards/ContentCard.vue'

export default {
  name: 'Discover',

  components: {
    ContentCard
  },

  data () {
    return {
      searchQuery: '',
      resultsFor: '',
      inputActive: false,
      searching: false,
      dataLoaded: false
    }
  },

  async fetch () {
    await this.search()
  },

  computed: {
    ...mapGetters('market', ['search_results'])
  },

  watch: {
    searchQuery () {
      this.inputActive = this.searchQuery.length > 0
    }
  },

  created () {
    this.searchQuery = (this.$route.query.q) ? this.$route.query.q : ''
  },

  mounted () {
    this.$refs.input.focus()
  },

  methods: {
    ...mapActions('market', ['fetchSearchResults']),

    searchActive () {
      this.$refs.label.classList.add('active')
      this.$refs.divider.classList.add('active')
    },

    searchBlured () {
      if (!this.inputActive) {
        this.$refs.label.classList.remove('active')
        this.$refs.divider.classList.remove('active')
      }
    },

    async search () {
      if (this.searchQuery.length <= 0) { return }

      this.resultsFor = this.searchQuery
      this.loading = true
      this.searching = true

      this.$router.push({ name: 'discover', query: { q: this.searchQuery } })
      await this.fetchSearchResults(this.searchQuery)

      this.loading = false
      this.searching = false
    }
  }
}
</script>

<style lang="scss">
</style>
