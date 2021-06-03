<template>
  <b-navbar id="headerCont" toggleable="lg" type="light">
    <b-container fluid="md">
      <b-navbar-brand to="/">
        <!-- <img id="logo-img" src="~/assets/images/logo_gray_scale.png"> -->
        <!-- <img id="logo-img" src="~/assets/images/logo_whiting.png"> -->
        <img id="logo-img" src="~/assets/images/logo_color.png">
        <small class="whitishColor textShadowBluish HeaderSize">
          NFTTunes
        </small>
      </b-navbar-brand>

      <b-navbar-toggle target="nav-collapse" />

      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav class="ml-auto">
          <b-nav-item :to="{ name: 'discover' }" title="Discover">
            <v-icon name="search" class="whitishColor" /> <span class="d-lg-none whitishColor">Discover</span>
          </b-nav-item>

          <b-nav-item :to="{ name: 'activity' }">
            <p class="whitishColor">
              Activity
            </p>
          </b-nav-item>

          <b-nav-item :to="{ name: 'gallery' }">
            <p class="whitishColor">
              Gallery
            </p>
          </b-nav-item>

          <b-nav-item v-if="!isAuthenticated" @click.prevent="$bvModal.show('loginModal')">
            <p class="whitishColor">
              Login
            </p>
          </b-nav-item>

          <template v-if="isAuthenticated">
            <b-nav-item v-if="isWhitelisted && profile.username === username" :to="{ name: 'user-tokenize', params: { user: username } }">
              <p class="whitishColor">
                Tokenize
              </p>
            </b-nav-item>

            <b-nav-item :to="{ name: 'user-collection', params: { user: username } }">
              <p class="whitishColor">
                Collection
              </p>
            </b-nav-item>

            <b-nav-item :to="{ name: 'user-wallet', params: { user: username } }">
              <p class="whitishColor">
                Wallet
              </p>
            </b-nav-item>

            <b-nav-item class="badge-holder" @click.prevent="$bvModal.show('activityModal')">
              <v-icon name="shopping-cart" class="whitishColor" />&nbsp;
              <b-badge v-if="cart.length > 0" pill variant="danger" class="navbar-badge">
                {{ cart.length }}
              </b-badge>
              <!-- <p class="whitishColor">
                Cart
              </p> -->
            </b-nav-item>

            <b-nav-item-dropdown
              text="Lang"
              right
              no-caret
              menu-class="notifications-dropdown"
              title="Notifications"
              toggle-class="badge-holder"
            >
              <template #button-content>
                <v-icon name="bell" class="whitishColor" /> <span class="d-lg-none">Notification</span>
                <b-badge v-if="notifications.length > 0" class="navbar-badge" pill variant="primary">
                  {{ notifications.length }}
                </b-badge>
              </template>

              <NotificationsPanel />
            </b-nav-item-dropdown>

            <!-- <b-nav-item :to="{ name: 'user-messages', params: { user: username } }" title="Private Messages" link-classes="badge-holder">
              <v-icon name="message-square" /> <span class="d-lg-none">Messages</span>
              <b-badge v-if="newMessages > 0" class="navbar-badge" pill variant="danger">
                {{ newMessages }}
              </b-badge>
            </b-nav-item> -->

            <b-nav-item :to="{ name: 'user', params: { user: username } }">
              <p class="whitishColor">
                @{{ username }}
              </p>
            </b-nav-item>

            <b-nav-item @click.prevent="logout($router)">
              <p class="whitishColor">
                Logout
              </p>
            </b-nav-item>
          </template>
        </b-navbar-nav>
      </b-collapse>
    </b-container>
  </b-navbar>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import NotificationsPanel from '@/components/NotificationsPanel.vue'

export default {
  name: 'Navbar',

  components: {
    NotificationsPanel
  },

  computed: {
    ...mapGetters('user', ['isAuthenticated', 'isWhitelisted', 'username', 'profile', 'notifications']),
    ...mapGetters('cart', ['cart']),
    ...mapGetters('message', ['conversations']),

    newMessages () {
      return this.conversations.reduce((acc, cur) => acc + cur.unread, 0)
    }
  },

  methods: {
    ...mapActions('user', ['logout'])
  }
}
</script>

<style lang="scss">
.badge-holder {
  position: relative;

  &.dropdown-toggle {
    white-space: normal;
  }
}

.navbar-badge {
  position: absolute;
  top: 3px;
  left: 20px;
}
</style>
