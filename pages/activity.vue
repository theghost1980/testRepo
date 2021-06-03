<template>
  <div class="activity">
    <h1 class="h3 text-uppercase text-center mb-5">
      Activity
    </h1>

    <template v-if="loading">
      <Loading />
    </template>

    <template v-else>
      <div v-if="trades_history.length <= 0" class="text-center">
        <p class="h5">
          No activities found!
        </p>
      </div>

      <div v-for="(history,i) of trades_history" :key="i">
        <ContentCardActivity :data="history" route="gallery-collectible" />
      </div>
    </template>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import ContentCardActivity from '@/components/cards/ContentCardActivity.vue'
import Loading from '@/components/Loading.vue'

export default {
  name: 'Activity',

  components: {
    Loading,
    ContentCardActivity
  },

  async fetch () {
    this.loading = true

    await this.fetchTradesHistory(50)

    this.loading = false
  },

  computed: {
    ...mapGetters('market', ['trades_history'])
  },

  methods: {
    ...mapActions('market', ['fetchTradesHistory'])
  }
}
</script>

<style>
</style>
