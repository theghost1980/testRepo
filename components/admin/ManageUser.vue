<template>
  <div id="manage-user">
    <b-card>
      <template #header>
        <h2 class="mb-0 h5">
          Manage User
        </h2>
      </template>

      <b-alert :show="show_success" dismissible fade variant="success">
        User update request has been broadcasted.
      </b-alert>

      <b-row>
        <b-col md="7">
          <b-form-group label="Username" label-for="username" label-sr-only>
            <b-form-input
              id="username"
              v-model="username"
              placeholder="Username"
              trim
            />
          </b-form-group>
        </b-col>

        <b-col md="5">
          <b-button
            variant="primary"
            :disabled="username.length < 3"
            @click.prevent="fetchProfile"
          >
            Lookup
          </b-button>
        </b-col>
      </b-row>

      <template v-if="!not_found">
        <table class="table mt-3">
          <tr>
            <th>Username</th>
            <td colspan="2">
              {{ username }}
            </td>
          </tr>
          <tr>
            <th class="w-25">
              Admin
            </th>
            <td class="w-25">
              {{ admin ? "Yes" : "No" }}
            </td>
            <td />
          </tr>
          <tr>
            <th class="w-25">
              Whitelisted
            </th>
            <td class="w-25">
              {{ whitelisted ? "Yes" : "No" }}
            </td>
            <td>
              <b-form-checkbox
                v-model="whitelisted"
                name="whitelisted"
                switch
              />
            </td>
          </tr>
          <tr>
            <th class="w-25">
              Whitelist Applied
            </th>
            <td class="w-25">
              {{ whitelist_applied ? "Yes" : "No" }}
            </td>
            <td />
          </tr>
          <tr>
            <th class="w-25">
              Banned
            </th>
            <td class="w-25">
              {{ banned ? "Yes" : "No" }}
            </td>
            <td>
              <b-form-checkbox v-model="banned" name="banned" switch />
            </td>
          </tr>
          <tr v-if="banned">
            <th class="w-25">
              Ban Reason
            </th>
            <td class="w-25">
              {{ ban_reason }}
            </td>
            <td>
              <b-form-textarea
                v-model="ban_reason"
                placeholder="Enter a reason..."
              />
            </td>
          </tr>
        </table>

        <p class="text-right">
          <b-button
            variant="primary"
            :disabled="!dataLoaded || username.length < 3"
            @click.prevent="manageUser"
          >
            Update User
          </b-button>
        </p>
      </template>

      <b-alert class="mt-2" dismissible :show="not_found">
        User not found!
      </b-alert>
    </b-card>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'ManageUser',

  data () {
    return {
      username: '',
      admin: false,
      banned: false,
      whitelisted: false,
      whitelist_applied: false,
      ban_reason: '',
      not_found: false,
      dataLoaded: false,
      show_success: false
    }
  },

  watch: {
    username () {
      this.dataLoaded = false
    }
  },

  mounted () {
    this.$eventBus.$on('MANAGE_USER_PROCESSED', () => {
      this.show_success = true
    })
  },

  beforeDestroy () {
    this.$eventBus.$off('MANAGE_USER_PROCESSED')
  },

  methods: {
    ...mapActions('admin', ['requestManageUser']),

    async fetchProfile () {
      try {
        const profile = await this.$API.call('users/profile', { username: this.username })

        if (profile && profile.username) {
          const { admin, whitelisted, whitelist_applied: whitelistApplied, banned, ban_reason: banReason } = profile

          this.admin = admin
          this.whitelisted = whitelisted
          this.whitelist_applied = whitelistApplied
          this.banned = banned
          this.ban_reason = banReason

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

    manageUser () {
      const data = {
        username: this.username,
        ban: this.banned,
        whitelist: this.whitelisted,
        ban_reason: this.ban_reason
      }

      this.requestManageUser(data)
    }
  }
}
</script>

<style>
</style>
