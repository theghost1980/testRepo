<template>
  <div class="statistics">
    <LineChart v-if="dataLoaded" class="mt-3 mb-3" :data="chartData" />

    <b-table striped :items="statistics" :fields="fields" />

    <p class="text-muted">
      * Sales volume is in {{ settings.currency }}
    </p>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import LineChart from '@/components/charts/LineChart.vue'

export default {
  name: 'Statistics',

  components: {
    LineChart
  },

  data () {
    return {
      dataLoaded: false,
      fields: [
        { key: 'timestamp', label: 'DATE', formatter: v => v.toDateString() },
        { key: 'users', label: 'USER' },
        { key: 'total_transactions', label: 'TRANSACTIONS' },
        { key: 'sales_volume', label: 'SALES VOLUME', formatter: v => parseFloat(v).toFixed(3) }
      ],
      colors: {
        red: '#f94e3f',
        purple: '#6C49B8',
        green: '#3ac569'
      },
      chartData: {}
    }
  },

  async fetch () {
    await this.loadStatistics()
  },

  computed: {
    ...mapGetters(['settings']),
    ...mapGetters('admin', ['statistics'])
  },

  watch: {
    dataLoaded (loaded) {
      if (loaded) { this.produceChart() }
    }
  },

  methods: {
    ...mapActions('admin', ['fetchStatistics']),

    async loadStatistics () {
      this.dataLoaded = false

      await this.fetchStatistics(30)

      this.dataLoaded = true
    },

    produceChart () {
      const data = this.statistics.slice().reverse()

      const labels = data.map(s => new Date(s.timestamp).toLocaleDateString())

      const datasets = data.reduce((a, c) => {
        a[0].push(c.users)
        a[1].push(c.sales_volume)
        a[2].push(c.total_transactions)

        return a
      }, [[], [], []])

      this.chartData = {
        labels,
        datasets: [
          {
            label: 'Users',
            backgroundColor: this.colors.red,
            borderColor: this.colors.red,
            data: datasets[0],
            fill: true
          },
          {
            label: 'Sales Volume',
            backgroundColor: this.colors.purple,
            borderColor: this.colors.purple,
            data: datasets[1],
            fill: true
          },
          {
            label: 'Transactions',
            backgroundColor: this.colors.green,
            borderColor: this.colors.green,
            data: datasets[2],
            fill: true
          }
        ]
      }
    }
  }
}
</script>

<style>
</style>
