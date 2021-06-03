<template>
  <div class="all-collectible">
    <b-row>
      <b-col sm="6" md="3" align-self="center">
        <span class="font-weight-bold">Total: {{ rows }}</span>
      </b-col>

      <b-col sm="6" md="3">
        <b-form-group label="Category">
          <b-form-select v-model="filter.category" :options="categoryOptions" />
        </b-form-group>
      </b-col>

      <b-col sm="6" md="3">
        <b-form-group label="Filters">
          <b-form-select v-model="filter.filter" :options="filterOptions" />
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
      <template #cell(thumbnail)="data">
        <ContentCard :thumbnail="data.item.thumbnail" :file="data.item.file" />
      </template>

      <template #cell(name)="data">
        <nuxt-link
          :to="{
            name: 'gallery-collectible',
            params: { collectible: data.item.series },
          }"
          target="_blank"
        >
          {{ data.item.name }}
        </nuxt-link>
        <p class="m-0 small text-muted">
          Series: {{ data.item.series }}<br>
          Category: {{ data.item.category }}
        </p>
      </template>

      <template #cell(published)="data">
        {{ data.item.published ? "Yes" : "No" }}
      </template>

      <template #cell(featured)="data">
        {{ data.item.featured ? "Yes" : "No" }}
      </template>

      <template #cell(nsfw)="data">
        {{ data.item.nsfw ? "Yes" : "No" }}
      </template>

      <template #cell(created_at)="data">
        {{ new Date(data.item.created_at).toLocaleString() }}
      </template>

      <template #cell(actions)="data">
        <b-button
          v-if="data.item.published && !data.item.featured"
          variant="warning"
          size="sm"
          @click.passive="featureCollectible(data.item.series, true)"
        >
          Feature
        </b-button>

        <b-button
          v-if="data.item.featured"
          variant="info"
          size="sm"
          @click.passive="featureCollectible(data.item.series, false)"
        >
          Unfeature
        </b-button>
      </template>
    </b-table>

    <b-pagination
      v-model="currentPage"
      align="center"
      :total-rows="rows"
      :per-page="perPage"
    />
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import ContentCard from '@/components/cards/ContentCardSmall.vue'

export default {
  name: 'AllCollectibles',

  components: {
    ContentCard
  },

  data () {
    return {
      dataLoaded: true,
      currentPage: 1,
      perPage: 30,
      totalRows: 30,
      filter: {
        category: null,
        filter: null
      },
      category: null,
      fields: [
        { key: 'thumbnail', label: '' },
        { key: 'name', label: 'NAME' },
        { key: 'published', label: 'PUBLISHED' },
        { key: 'featured', label: 'FEATURED' },
        { key: 'nsfw', label: 'NSFW' },
        { key: 'created_at', label: 'CREATED AT', sortable: true },
        { key: 'actions', label: '' }
      ],
      filterOptions: [
        { value: null, text: '--' },
        { value: { published: true }, text: 'Published' },
        { value: { published: false }, text: 'Unpublished' },
        { value: { featured: true }, text: 'Featured' },
        { value: { featured: false }, text: 'Not Featured' }
      ]
    }
  },

  computed: {
    ...mapGetters(['settings']),

    categoryOptions () {
      return [{ value: null, text: 'Select a category' }, ...this.settings.categories]
    },

    rows () {
      return this.totalRows
    }
  },

  methods: {
    ...mapActions('admin', ['requestFeatureCollectible']),

    async itemsProvider (ctx) {
      let query = {
        page: ctx.currentPage,
        limit: ctx.perPage,
        sort_by: ctx.sortBy,
        descending: ctx.sortDesc
      }

      if (ctx.filter.filter) {
        query = { ...query, ...ctx.filter.filter }
      }

      if (ctx.filter.category) {
        query.category = ctx.filter.category
      }

      try {
        const { total, results } = await this.$API.call('admin/collectibles', query)

        this.totalRows = total

        return results
      } catch (e) {
        console.log(e.message)
      }

      return []
    },

    featureCollectible (series, featured) {
      return this.requestFeatureCollectible({
        series,
        featured
      })
    }
  }
}
</script>

<style>
</style>
