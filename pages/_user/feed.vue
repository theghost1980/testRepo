<template>
  <div class="user-feed">
    <h1 class="h4">
      Feed
    </h1>
    <hr>

    <template v-if="loading">
      <Loading />
    </template>

    <template v-else>
      <p v-if="feed.length <= 0" class="text-center h5 mt-5">
        No new update found!
      </p>

      <div v-else>
        <b-row v-for="(h,i) of feed" :key="i" no-gutters>
          <b-col cols="11">
            <ContentCardFeed :data="h" />
          </b-col>

          <b-col cols="1" class="text-right">
            <b-dropdown size="xs" variant="link" toggle-class="text-decoration-none" no-caret>
              <template #button-content>
                <v-icon name="more-vertical" />
              </template>
              <b-dropdown-item-button
                @click.prevent="requestFollow({username: h.creator, follow:!isFollowing(h.creator) })"
              >
                {{ isFollowing ? 'Unfollow': 'Follow' }}
              </b-dropdown-item-button>
            </b-dropdown>
          </b-col>
        </b-row>
      </div>
    </template>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import ContentCardFeed from '@/components/cards/ContentCardFeed.vue'

export default {
  name: 'Feed',

  components: {
    ContentCardFeed
  },

  async fetch () {
    this.loading = true

    await this.fetchUserFeed({ username: this.$route.params.user })

    this.loading = false
  },

  computed: {
    ...mapGetters('user', ['feed', 'following'])
  },

  methods: {
    ...mapActions('user', ['fetchUserFeed', 'requestFollow']),

    isFollowing (username) {
      return this.following.includes(username)
    }
  }
}
</script>

<style>
</style>
