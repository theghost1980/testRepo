import { toFixedWithoutRounding } from '@/helpers'

export const state = () => ({
  username: '',
  authenticated: false,
  smartlock: false,
  whitelisted: false,
  admin: false,
  profile: {},
  notifications: [],
  history: [],
  following: [],
  feed: [],
  token: ''
})

export const getters = {
  isAdmin: state => state.admin,
  isAuthenticated: state => state.authenticated,
  isWhitelisted: state => state.whitelisted,
  username: state => state.username,
  profile: state => state.profile,
  notifications: state => state.notifications,
  history: state => state.history,
  following: state => state.following,
  feed: state => state.feed,
  token: state => state.token
}

export const mutations = {
  SET_USER: (state, data) => {
    state.username = data.username
    state.authenticated = data.authenticated
    state.admin = data.admin
    state.smartlock = data.smartlock
    state.whitelisted = data.whitelisted
    state.token = data.token
  },

  SET_PROFILE: (state, data) => {
    state.profile = data
  },

  SET_FOLLOWING: (state, data) => {
    state.following = data
  },

  SET_NOTIFICATIONS: (state, data) => {
    state.notifications = data
  },

  SET_HISTORY: (state, data) => {
    state.history = data
  },

  SET_FEED: (state, data) => {
    state.feed = data
  }
}

export const actions = {
  login ({ dispatch }, { username, redirect = null }) {
    if (!username) { return }

    if (!window.hive_keychain) { return }

    const ts = Date.now()

    window.hive_keychain.requestSignBuffer(username, `${username}${ts}`, 'Posting', async (r) => {
      if (r.success) {
        await dispatch('processLogin', { username, ts, sig: r.result, smartlock: false, redirect })
      }
    })
  },

  async loginWithKey ({ dispatch }, { username, wif, redirect = null }) {
    if (!username) { return }

    if (!wif || !localStorage.getItem(`smartlock-${username}`)) {
      return
    }

    wif = wif || localStorage.getItem(`smartlock-${username}`)

    try {
      const ts = Date.now()
      const key = (wif.length > 51) ? atob(wif) : wif
      const privateKey = this.$HIVE.PrivateKey.fromString(key)
      const sig = privateKey.sign(Buffer.from(this.$HIVE.cryptoUtils.sha256(username + ts))).toString()

      await dispatch('processLogin', { username, ts, sig, smartlock: true, redirect })
    } catch (e) {
      console.log(e)
    }
  },

  async processLogin ({ commit, dispatch }, { username, ts, sig, smartlock, redirect }) {
    try {
      const { token, admin, whitelisted } = await this.$API.call('auth/login', { username, ts, sig })

      commit('SET_USER', { username, admin, authenticated: true, smartlock, token, whitelisted })

      await Promise.all([
        dispatch('fetchNotifications'),
        dispatch('fetchProfile')
      ])

      localStorage.setItem('username', username)
      localStorage.setItem('smartlock', smartlock)

      if (redirect) {
        const uri = atob(redirect)

        this.$router.push(uri)
      }
    } catch {
      //
    }
  },

  async verifyLogin ({ commit, dispatch }, redirect) {
    try {
      const { success, username, token, admin, whitelisted } = await this.$API.call('auth/me')
      const smartlock = localStorage.getItem('smartlock') ? JSON.parse(localStorage.getItem('smartlock')) : false

      if (success) {
        commit('SET_USER', { username, admin, authenticated: true, smartlock, token, whitelisted })

        localStorage.setItem('username', username)

        await Promise.all([
          dispatch('fetchNotifications'),
          dispatch('fetchProfile')
        ])

        if (redirect) {
          const uri = atob(redirect)

          this.$router.push(uri)
        }
      } else {
        commit('SET_USER', {
          username: '',
          admin: false,
          authenticated: false,
          smartlock: false,
          whitelisted: false,
          token: ''
        })
      }
    } catch (e) {
      console.log(e.message)
    }
  },

  async fetchProfile ({ commit }) {
    try {
      const profile = await this.$API.call('users/profile')

      commit('SET_PROFILE', profile)
    } catch (e) {
      console.log(e.message)
    }
  },

  async fetchNotifications ({ state, commit }) {
    try {
      const data = await this.$API.call('users/notifications', { username: state.username })

      const notifications = data.map(d => ({ ...d, data: JSON.parse(d.data) }))

      commit('SET_NOTIFICATIONS', notifications)
    } catch (e) {
      console.log(e.message)
    }
  },

  async fetchUserHistory ({ state, commit }, { username = null, limit = 100 }) {
    try {
      let history = await this.$API.call('transactions/history', { username: username || state.username, limit })

      history = history.map(h => ({ ...h, data: JSON.parse(h.data) }))

      commit('SET_HISTORY', history)
    } catch (e) {
      console.log(e.message)
    }
  },

  async fetchUserFeed ({ state, commit }, { username = null, limit = 100 }) {
    try {
      const feed = await this.$API.call('users/feed', { username: username || state.username, limit })

      commit('SET_FEED', feed)
    } catch (e) {
      console.log(e.message)
    }
  },

  requestHEDeposit ({ state, rootState }, amount) {
    const memo = JSON.stringify({
      id: rootState.settings.sidechain_id,
      json: {
        contractName: 'hivepegged',
        contractAction: 'buy',
        contractPayload: {}
      }
    })

    if (state.smartlock) {
      const { username } = state
      const client = this.$HIVE.getClient()

      this.$router.app.$root.$bvModal.msgBoxConfirm('Are you sure?', {
        centered: true,
        okVariant: 'success',
        okTitle: 'Yes'
      })
        .then(async (value) => {
          if (value) {
            try {
              const wif = localStorage.getItem(`smartlock-${username}`)
              const key = (wif.length > 51) ? atob(wif) : wif
              const privateKey = this.$HIVE.PrivateKey.fromString(key)

              await client.broadcast.transfer({
                from: username,
                to: 'honey-swap',
                amount: this.$HIVE.Asset.from(amount, 'HIVE'),
                memo
              }, privateKey)

              this.$eventBus.$emit('he-deposit-request-successful')
            } catch (e) {
              console.log(e.message)
            }
          }
        })
        .catch((e) => {
          console.log(e.message)
        })
    } else {
      window.hive_keychain.requestTransfer(state.username, 'honey-swap', Number(amount).toFixed(3), memo, 'HIVE', (r) => {
        if (r.success) {
          this.$eventBus.$emit('he-deposit-request-successful')
        }
      }, true)
    }
  },

  requestHEWithdrawal ({ dispatch, rootState }, amount) {
    const json = {
      contractName: 'hivepegged',
      contractAction: 'withdraw',
      contractPayload: {
        quantity: toFixedWithoutRounding(amount).toFixed(3)
      }
    }

    const jsonData = {
      id: rootState.settings.sidechain_id,
      key: 'Active',
      data: json,
      message: 'Withdraw',
      eventName: 'he-withdrawal-request-successful'
    }

    dispatch('requestCustomJson', jsonData, { root: true })
  },

  async requestUpdateProfile (_, data) {
    try {
      await this.$API.$post('users/profile', data)

      this.$eventBus.$emit('user-profile-updated')
    } catch {
      //
    }
  },

  async requestApplyForWhitelist () {
    try {
      await this.$API.$post('users/whitelist/apply')

      this.$eventBus.$emit('whitelist-apply-successful')
    } catch {
      //
    }
  },

  async markNotificationsAsRead ({ state, commit }) {
    try {
      await this.$API.post('users/notifications', { ids: state.notifications.map(n => n.id) })

      commit('SET_NOTIFICATIONS', [])
    } catch (e) {
      console.log(e.message)
    }
  },

  async requestFollow ({ state, commit }, data) {
    try {
      const request = await this.$API.$post('users/follow', data)

      if (request.success) {
        const following = state.following.slice()

        if (data.follow) {
          commit('SET_FOLLOWING', [...following, data.username])
        } else {
          following.splice(following.indexOf(data.username), 1)

          commit('SET_FOLLOWING', following)
        }
      }
    } catch (e) {
      console.log(e.message)
    }
  },

  async logout ({ state, commit }) {
    localStorage.removeItem('username')
    localStorage.removeItem('smartlock')
    localStorage.removeItem('token')
    localStorage.removeItem(`smartlock-${state.username}`)

    await this.$API.call('auth/logout')

    commit('SET_USER', {
      username: '',
      admin: false,
      authenticated: false,
      smartlock: false,
      whitelisted: false,
      token: ''
    })

    // if (rootState.socket.isConnected) {
    //   this.$websocket.$disconnect()
    // }

    this.$router.push('/')
  }
}
