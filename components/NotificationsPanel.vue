<template>
  <div id="notifications" class="notifications-panel">
    <div class="dropdown-header">
      Notifications
      <a
        v-if="notifications.length > 0"
        href="#"
        class="float-right"
        @click.prevent="markNotificationsAsRead"
      >Mark all as read</a>
    </div>

    <p v-if="notifications.length <= 0" class="notifications-empty">
      No new notifications.
    </p>

    <div v-else class="notification-list">
      <b-media
        v-for="(n, i) of notifications"
        :key="i"
        no-body
        class="notification"
      >
        <b-media-aside vertical-align="center" class="notification-icon">
          <div :class="`rounded-icon ${n.type}`">
            <template v-if="n.type === 'sell'">
              <v-icon name="arrow-up-right" />
            </template>

            <template v-if="n.type === 'buy'">
              <v-icon name="arrow-down-left" />
            </template>

            <template v-if="n.type === 'gift'">
              <v-icon name="gift" />
            </template>

            <template
              v-if="n.type === 'royalty_payment' || n.type === 'referral_bonus'"
            >
              <v-icon name="dollar-sign" />
            </template>
          </div>
        </b-media-aside>

        <b-media-body>
          <template v-if="n.type === 'sell'">
            You have sold music to
            <nuxt-link
              :to="{ name: 'user-collection', params: { user: n.data.buyer } }"
            >
              @{{ n.data.buyer }}
            </nuxt-link>
          </template>

          <template v-if="n.type === 'buy'">
            You have bought music from
            <nuxt-link
              :to="{ name: 'user-collection', params: { user: n.data.seller } }"
            >
              @{{ n.data.seller }}
            </nuxt-link>
          </template>

          <template v-if="n.type === 'gift'">
            You have received a gift from
            <nuxt-link
              :to="{ name: 'user-collection', params: { user: n.data.from } }"
            >
              @{{ n.data.from }}
            </nuxt-link>
          </template>

          <template v-if="n.type === 'royalty_payment'">
            You received royalty payment of {{ n.data.amount }}
            {{ n.data.symbol }}
          </template>

          <template v-if="n.type === 'referral_bonus'">
            You received referral bonus of {{ n.data.amount }}
            {{ n.data.symbol }}
          </template>

          <div v-if="n.type !== 'referral_bonus'" class="small text-muted">
            Edition #{{ n.data.edition }} of series
            <nuxt-link
              :to="{ name: 'gallery-collectible', params: { collectible: n.data.series } }"
            >
              {{ n.data.series }}
            </nuxt-link>
            {{ n.data.price ? `for ${n.data.price} ${n.data.symbol}` : "" }}.
          </div>
        </b-media-body>
      </b-media>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'Notifications',

  computed: {
    ...mapGetters('user', ['notifications'])
  },

  methods: {
    ...mapActions('user', ['markNotificationsAsRead'])
  }
}
</script>

<style>
</style>
