<template>
  <div id="collection">
    <h1 class="h4">
      Collection
    </h1>
    <hr>

    <template v-if="loading">
      <Loading />
    </template>

    <template v-else>
      <div v-if="series.length <= 0" class="text-center">
        <p class="h5">
          No item found!
        </p>
      </div>

      <b-row v-else>
        <b-col v-for="(s,i) of series" :key="i" md="6" xl="4">
          <ContentCard :series="s" route="user-collection-collectible" />
        </b-col>
      </b-row>
    </template>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import ContentCard from '@/components/cards/ContentCard.vue'

export default {
  name: 'UserCollection',

  components: {
    ContentCard
  },

  async fetch () {
    this.loading = true

    await this.fetchCollection({ account: this.$route.params.user })

    this.loading = false
  },

  computed: {
    ...mapGetters('collectible', ['series'])
  },

  methods: {
    ...mapActions('collectible', ['fetchCollection'])
  }
}
</script>

<style>
</style>
