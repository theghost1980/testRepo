<template>
  <div class="reports">
    <template v-if="!dataLoaded">
      <Loading />
    </template>

    <template v-else>
      <b-table
        striped
        hover
        responsive
        show-empty
        :items="reports"
        :fields="fields"
      >
        <template #cell(series)="data">
          <nuxt-link
            :to="{
              name: 'gallery-collectible',
              params: { collectible: data.item.series },
            }"
            target="_blank"
          >
            {{ data.item.series }}
          </nuxt-link>
        </template>
        <template #cell(actions)="data">
          <b-button
            variant="success"
            size="sm"
            title="Processed"
            @click.prevent="
              requestProcessReport({ report_id: data.item.report_id })
            "
          >
            <v-icon name="check" />Processed
          </b-button>
        </template>
      </b-table>
    </template>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from 'vuex'

export default {
  name: 'Reports',

  data () {
    return {
      dataLoaded: true,
      fields: [
        { key: 'series', label: 'SERIES' },
        { key: 'type', label: 'TYPE' },
        { key: 'username', label: 'USER' },
        { key: 'message', label: 'MESSAGE' },
        { key: 'actions', label: '' }
      ]
    }
  },

  async fetch () {
    this.dataLoaded = false

    await this.fetchReports()

    this.dataLoaded = true
  },

  computed: {
    ...mapGetters('admin', ['reports'])
  },

  mounted () {
    const self = this

    this.$eventBus.$on('COLLECTIBLE_REPORT_PROCESSED', (data) => {
      const reports = self.reports.filter(a => a.report_id !== data.report_id)

      self.SET_REPORTS(reports)
    })
  },

  beforeDestroy () {
    this.$eventBus.$off('COLLECTIBLE_REPORT_PROCESSED')
  },

  methods: {
    ...mapActions('admin', ['fetchReports', 'requestProcessReport']),
    ...mapMutations('admin', ['SET_REPORTS'])
  }
}
</script>

<style>
</style>
