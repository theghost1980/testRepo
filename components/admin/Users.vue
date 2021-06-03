<template>
  <div class="all-users">
    <b-row>
      <b-col cols="6" sm="5" md="4" lg="3" align-self="center">
        <span class="font-weight-bold">Total: {{ rows }}</span>
      </b-col>

      <b-col
        offset-sm="2"
        offset-md="4"
        offset-lg="6"
        cols="6"
        sm="5"
        md="4"
        lg="3"
      >
        <b-form-group label="Filters">
          <b-form-select v-model="filter" :options="filterOptions" />
        </b-form-group>
      </b-col>
    </b-row>

    <b-table
      striped
      hover
      responsive
      show-empty
      :items="itemsProvider"
      :fields="fields"
      :per-page="perPage"
      :current-page="currentPage"
      sort-by="created_at"
      :sort-desc="true"
      :filter="filter"
    >
      <template #cell(avatar)="data">
        <b-avatar
          variant="light"
          :src="`${$config.API_BASE_URL}/avatar/${data.item.username}`"
          size="100px"
        />
      </template>

      <template #cell(username)="data">
        {{ data.item.full_name }}
        <br>
        <nuxt-link
          :to="{name: 'user-gallery', params: {user: data.item.username}}"
          target="_blank"
        >
          @{{ data.item.username }}
        </nuxt-link>
      </template>

      <template #cell(social_profiles)="data">
        <ul class="list-unstyled">
          <li v-if="data.item.website">
            <a :href="`${data.item.website}`">{{ data.item.website }}</a>
          </li>
          <li v-if="data.item.instagram">
            <a :href="`${data.item.instagram}`">{{ data.item.instagram }}</a>
          </li>
          <li v-if="data.item.twitter">
            <a :href="`${data.item.twitter}`">{{ data.item.twitter }}</a>
          </li>
          <li v-if="data.item.spotify">
            <a :href="`${data.item.spotify}`">{{ data.item.spotify }}</a>
          </li>
          <li v-if="data.item.soundcloud">
            <a :href="`${data.item.soundcloud}`">{{ data.item.soundcloud }}</a>
          </li>
        </ul>
      </template>

      <template #cell(whitelisted)="data">
        {{ data.item.whitelisted ? 'Yes': 'No' }}
      </template>

      <template #cell(banned)="data">
        {{ data.item.banned ? 'Yes': 'No' }}
      </template>

      <template #cell(created_at)="data">
        {{ new Date(data.item.created_at).toLocaleString() }}
      </template>
    </b-table>

    <b-pagination v-model="currentPage" align="center" :total-rows="rows" :per-page="perPage" />
  </div>
</template>

<script>
export default {
  name: 'AllUsers',

  data () {
    return {
      dataLoaded: true,
      currentPage: 1,
      perPage: 30,
      totalRows: 30,
      filter: null,
      fields: [
        { key: 'avatar', label: '' },
        { key: 'username', label: 'NAME' },
        { key: 'social_profiles', label: 'SOCIALS' },
        { key: 'whitelisted', label: 'VERIFIED' },
        { key: 'banned', label: 'BANNED' },
        { key: 'created_at', label: 'JOINED AT', sortable: true }
      ],
      filterOptions: [
        { value: null, text: '--' },
        { value: { whitelisted: true }, text: 'Whitelisted' },
        { value: { whitelisted: false }, text: 'Not Whitelisted' },
        { value: { banned: true }, text: 'Banned' }
      ]
    }
  },

  computed: {
    rows () {
      return this.totalRows
    }
  },

  methods: {

    async itemsProvider (ctx) {
      try {
        const { total, results } = await this.$API.call('admin/users', {
          page: ctx.currentPage,
          limit: ctx.perPage,
          sort_by: ctx.sortBy,
          descending: ctx.sortDesc,
          ...ctx.filter
        })

        this.totalRows = total

        return results
      } catch (e) {
        console.log(e.message)
      }

      return []
    }
  }
}
</script>

<style>
</style>
