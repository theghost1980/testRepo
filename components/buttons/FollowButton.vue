<template>
  <b-button
    v-if="isAuthenticated && user !== username"
    :size="size"
    :variant="variant"
    @click.prevent="requestFollow({username: user, follow: !isFollowing })"
  >
    {{ isFollowing ? 'Unfollow': 'Follow' }}
  </b-button>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'FollowButton',

  props: {
    user: { type: String, required: true },
    size: { type: String, default: 'sm' },
    variant: { type: String, default: 'primary' }
  },

  computed: {
    ...mapGetters('user', ['isAuthenticated', 'username', 'following']),

    isFollowing () {
      return this.following.includes(this.user)
    }
  },

  methods: {
    ...mapActions('user', ['requestFollow'])
  }
}
</script>

<style>
</style>
