<template>
  <div class="profile-main">
    <b-row>
      <b-col md="4" lg="3" class="mt-5">
        <div class="profile-head">
          <b-avatar
            variant="light"
            crossorigin
            :src="`${$config.API_BASE_URL}/avatar/${$route.params.user}`"
            class="border"
            size="8rem"
          />

          <h4 class="mt-3 mb-3 text-break">
            @{{ $route.params.user }}
            <VerifiedBadge />
          </h4>

          <FollowButton :user="$route.params.user" />
          <!-- <MessageButton :user="$route.params.user" /> -->
        </div>

        <b-nav v-if="isAuthenticated && username === $route.params.user" vertical class="mt-5">
          <b-nav-item :to="{ name: 'user-feed', params: { username } }">
            Feed
          </b-nav-item>
          <b-nav-item :to="{ name: 'user-gallery', params: { username } }">
            Gallery
          </b-nav-item>
          <b-nav-item :to="{ name: 'user-collection', params: { username } }">
            Collection
          </b-nav-item>
          <!-- <b-nav-item :to="{ name: 'user-messages', params: { username } }">
            Messages
          </b-nav-item> -->
          <b-nav-item :to="{ name: 'user-profile', params: { username } }">
            Profile
          </b-nav-item>

          <b-nav-item v-if="isWhitelisted" :to="{ name: 'user-tokenize', params: { user: username } }">
            Tokenize
          </b-nav-item>

          <b-nav-item :to="{ name: 'user-wallet', params: { user: username } }">
            Wallet
          </b-nav-item>
          <b-nav-item :to="{ name: 'user-transactions', params: { user: username } }">
            Transactions
          </b-nav-item>
          <b-nav-item v-if="isAdmin" :to="{ name: 'admin' }">
            Admin
          </b-nav-item>
          <b-nav-item @click.prevent="logout($router)">
            Logout
          </b-nav-item>
        </b-nav>

        <b-nav v-if="username !== $route.params.user" vertical class="mt-5">
          <b-nav-item
            :to="{ name: 'user-gallery', params: { username: $route.params.user } }"
          >
            Gallery
          </b-nav-item>
          <b-nav-item
            :to="{ name: 'user-collection', params: { username: $route.params.user } }"
          >
            Collection
          </b-nav-item>
        </b-nav>
      </b-col>

      <b-col md="8" lg="9" class="mt-5">
        <template v-if="loading">
          <Loading />
        </template>

        <template v-else>
          <nuxt-child />
        </template>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import FollowButton from '@/components/buttons/FollowButton.vue'
// import MessageButton from '@/components/buttons/MessageButton.vue'
import VerifiedBadge from '@/components/badges/VerifiedBadge.vue'

export default {
  name: 'ProfileMain',

  components: {
    FollowButton,
    // MessageButton,
    VerifiedBadge
  },

  computed: {
    ...mapGetters('user', ['isAuthenticated', 'isWhitelisted', 'isAdmin', 'username'])
  }
}
</script>

<style>

</style>
