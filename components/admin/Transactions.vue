<template>
  <div class="transactions">
    <b-row>
      <b-col md="6">
        <b-form-group label="Collectible series or username" label-for="subject" label-sr-only>
          <b-form-input id="subject" v-model="subject" placeholder="Collectible series or username" trim />
        </b-form-group>
      </b-col>

      <b-col md="3">
        <b-form-select v-model="type" :options="searchOptions" />
      </b-col>

      <b-col md="3">
        <b-button
          variant="primary"
          :disabled="subject.length < 3"
          @click.prevent="fetchTransactions"
        >
          Lookup
        </b-button>
      </b-col>
    </b-row>

    <template v-if="dataLoaded">
      <h3 class="h5 mt-5 mb-3">
        Transaction history ({{ type }}): {{ subject }}
      </h3>
      <hr>

      <p v-if="history.length <= 0" class="text-center">
        No transaction found!
      </p>

      <div v-else>
        <ul class="list-unstyled">
          <li v-for="(h,i) of history" :key="i">
            <UserTransactionHistory
              v-if="type==='user'"
              :username="subject"
              :transaction="h"
              :admin="true"
            />

            <SeriesTransactionHistory
              v-if="type==='collectible'"
              :username="subject"
              :transaction="h"
              :admin="true"
            />
          </li>
        </ul>
      </div>
    </template>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import SeriesTransactionHistory from '@/components/SeriesTransactionHistory.vue'
import UserTransactionHistory from '@/components/UserTransactionHistory.vue'

export default {
  name: 'Transactions',

  components: {
    SeriesTransactionHistory,
    UserTransactionHistory
  },

  data () {
    return {
      subject: '',
      type: 'collectible',
      searchOptions: [
        { text: 'Collectible', value: 'collectible' },
        { text: 'User', value: 'user' }
      ],
      dataLoaded: false
    }
  },

  computed: {
    ...mapGetters('admin', ['history'])
  },

  watch: {
    subject () {
      this.dataLoaded = false
    },

    type () {
      this.dataLoaded = false
    }
  },

  methods: {
    ...mapActions('admin', ['fetchUserHistory', 'fetchCollectibleHistory']),

    async fetchTransactions () {
      this.dataLoaded = false

      if (this.type === 'user') { await this.fetchUserHistory({ username: this.subject }) }
      if (this.type === 'collectible') { await this.fetchCollectibleHistory({ series: this.subject, types: 'issue,buy,transfer,sell,burn' }) }

      this.dataLoaded = true
    }
  }
}
</script>

<style>
</style>
