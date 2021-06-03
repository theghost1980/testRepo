<template>
  <div id="manage-collectible">
    <b-card>
      <template #header>
        <h2 class="mb-0 h5">
          Manage Collectible
        </h2>
      </template>

      <b-alert :show="show_success" dismissible fade variant="success">
        Collectible series update request has been broadcasted.
      </b-alert>

      <b-row>
        <b-col md="7">
          <b-form-group label="Collectible Series" label-for="series" label-sr-only>
            <b-form-input
              id="series"
              v-model="series"
              placeholder="Collectible series"
              trim
            />
          </b-form-group>
        </b-col>

        <b-col md="5">
          <b-button
            variant="primary"
            :disabled="series.length < 3"
            @click.prevent="fetchCollectible"
          >
            Lookup
          </b-button>
        </b-col>
      </b-row>

      <template v-if="!not_found">
        <table class="table mt-3">
          <tr>
            <th>Series</th>
            <td colspan="2">
              {{ series }}
            </td>
          </tr>
          <tr>
            <th class="w-25">
              NSFW
            </th>
            <td class="w-25">
              {{ nsfw ? "Yes" : "No" }}
            </td>
            <td>
              <b-form-checkbox v-model="nsfw" name="nsfw" switch />
            </td>
          </tr>
          <tr>
            <th class="w-25">
              Published
            </th>
            <td class="w-25">
              {{ published ? "Yes" : "No" }}
            </td>
            <td>
              <b-form-checkbox v-model="published" name="published" switch />
            </td>
          </tr>

          <tr>
            <th class="w-25">
              Category
            </th>
            <td class="w-25">
              {{ category }}
            </td>
            <td>
              <b-form-select
                v-model="category"
                :options="settings.categories"
                name="category"
              />
            </td>
          </tr>
        </table>

        <p class="text-right">
          <b-button
            variant="primary"
            :disabled="!dataLoaded || series.length < 3"
            @click.prevent="manageCollectible"
          >
            Update
          </b-button>
        </p>
      </template>

      <b-alert class="mt-2" dismissible :show="not_found">
        Collectible series not found!
      </b-alert>
    </b-card>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'ManageCollectible',

  data () {
    return {
      series: '',
      creator: '',
      nsfw: false,
      published: true,
      category: null,
      sub_category: null,
      not_found: false,
      dataLoaded: false,
      show_success: false
    }
  },

  computed: {
    ...mapGetters(['settings'])
  },

  watch: {
    series () {
      this.dataLoaded = false
    }
  },

  mounted () {
    this.$eventBus.$on('MANAGE_COLLECTIBLE_PROCESSED', () => {
      this.show_success = true
    })
  },

  beforeDestroy () {
    this.$eventBus.$off('MANAGE_COLLECTIBLE_PROCESSED')
  },

  methods: {
    ...mapActions('admin', ['requestManageCollectible']),

    async fetchCollectible () {
      try {
        const collectible = await this.$API.call('collectibles/info', { series: this.series })

        if (collectible) {
          const { creator, nsfw, published, category } = collectible
          this.creator = creator
          this.nsfw = nsfw
          this.published = published
          this.category = category

          this.not_found = false
          this.dataLoaded = true
        } else {
          this.dataLoaded = false
          this.not_found = true
        }
      } catch (e) {
        this.dataLoaded = false

        console.log(e.message)
      }
    },

    manageCollectible () {
      const data = {
        series: this.series,
        nsfw: this.nsfw,
        published: this.published,
        category: this.category
      }

      this.requestManageCollectible(data)
    }
  }
}
</script>

<style>
</style>
