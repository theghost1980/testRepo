<template>
  <div class="whitelist-applications">
    <template v-if="!dataLoaded">
      <Loading />
    </template>

    <template v-else>
      <b-table
        striped
        hover
        responsive
        show-empty
        :items="whitelistApplications"
        :fields="fields"
      >
        <template #cell(social_profiles)="data">
          <ul class="list-unstyled mb-0">
            <li v-if="data.value.website">
              <a :href="`${data.value.website}`">{{ data.value.website }}</a>
            </li>
            <li v-if="data.value.portfolio">
              <a :href="`${data.value.portfolio}`">{{
                data.value.portfolio
              }}</a>
            </li>
            <li v-if="data.value.instagram">
              <a :href="`${data.value.instagram}`">{{
                data.value.instagram
              }}</a>
            </li>
            <li v-if="data.value.twitter">
              <a :href="`${data.value.twitter}`">{{ data.value.twitter }}</a>
            </li>
            <li v-if="data.value.soundcloud">
              <a :href="`${data.value.soundcloud}`">{{
                data.value.soundcloud
              }}</a>
            </li>
          </ul>
        </template>
        <template #cell(actions)="data">
          <b-button
            variant="primary"
            size="sm"
            title="Accept"
            @click.prevent="
              requestProcessApplication({
                username: data.item.username,
                action:'approve',
                value: true,
              })
            "
          >
            <v-icon name="check" />
          </b-button>
          <b-button
            variant="danger"
            size="sm"
            title="Reject"
            @click.prevent="
              requestProcessApplication({
                username: data.item.username,
                action:'approve',
                value: false,
              })
            "
          >
            <v-icon name="x" />
          </b-button>
        </template>
      </b-table>
    </template>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from 'vuex'

export default {
  name: 'WhitelistApplications',

  data () {
    return {
      dataLoaded: true,
      fields: [
        { key: 'username', label: 'USER' },
        { key: 'bio', label: 'BIO' },
        { key: 'location', label: 'LOCATION' },
        { key: 'social_profiles', label: 'SOCIALS' },
        { key: 'actions', label: '' }
      ]
    }
  },

  async fetch () {
    await this.loadApplications()
  },

  computed: {
    ...mapGetters('admin', ['whitelistApplications'])
  },

  mounted () {
    const self = this

    this.$eventBus.$on('WHITELIST_APPLICATION_PROCESSED', (data) => {
      const applications = self.whitelistApplications.filter(a => a.username !== data.username)

      self.SET_WHITELIST_APPLICATIONS(applications)
    })
  },

  beforeDestroy () {
    this.$eventBus.$off('WHITELIST_APPLICATION_PROCESSED')
  },

  methods: {
    ...mapActions('admin', ['fetchWhitelistApplications', 'requestProcessApplication']),
    ...mapMutations('admin', ['SET_WHITELIST_APPLICATIONS']),

    async loadApplications () {
      this.dataLoaded = false

      await this.fetchWhitelistApplications()

      this.dataLoaded = true
    }
  }
}
</script>

<style>
</style>
