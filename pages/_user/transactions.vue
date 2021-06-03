<template>
  <div id="transactions">
    <h1 class="h4">
      Transaction History
    </h1>
    <hr>

    <template v-if="loading">
      <Loading />
    </template>

    <template v-else>
      <p v-if="history.length <= 0" class="text-center">
        No transaction found!
      </p>

      <ul v-else class="list-unstyled">
        <li v-for="(h,i) of history" :key="i">
          <UserTransactionHistory :username="username" :transaction="h" />
        </li>
      </ul>
    </template>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import UserTransactionHistory from '@/components/UserTransactionHistory.vue'

export default {
  name: 'Transactions',

  components: {
    UserTransactionHistory
  },

  data () {
    return {
      dataLoaded: false
    }
  },

  async fetch () {
    this.loading = true

    await this.fetchTransactionHistory()

    this.loading = false
  },

  computed: {
    ...mapGetters('user', ['history'])
  },

  created () {
    this.username = this.$route.params.user
  },

  methods: {
    ...mapActions('user', ['fetchUserHistory']),

    async fetchTransactionHistory () {
      await this.fetchUserHistory({ username: this.$route.params.user })
    }
  }
}
</script>

<style>
</style>
