import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export const state = () => ({
  settings: {},
  hive_price: 0,

  socket: {
    isConnected: false,
    message: '',
    reconnectError: false
  }
})

export const getters = {
  settings: state => state.settings,
  hive_price: state => Number(state.hive_price)
}

export const mutations = {
  SET_SETTINGS: (state, data) => {
    state.settings = data
  },

  SET_HIVE_PRICE: (state, data) => {
    state.hive_price = data
  },

  SOCKET_ONOPEN (state, event) {
    Vue.prototype.$socket = event.currentTarget
    state.socket.isConnected = true

    if (this.state.user.authenticated) {
      this.dispatch('message/authenticateWebsocket', { token: this.state.message.token })
    }
  },

  SOCKET_ONCLOSE (state, event) {
    state.socket.isConnected = false
    this.commit('message/SET_ONLINE', false, { root: true })
  },

  SOCKET_ONMESSAGE (state, message) {
    const data = JSON.parse(message.data)

    if (data.type === 'status' && data.payload.authenticated) {
      this.commit('message/SET_ONLINE', data.payload.authenticated, { root: true })
    }

    if (data.type === 'reauthentication-required') {
      this.dispatch('message/refreshToken', { root: true })
    }

    if (data.type === 'chat-message') {
      this.commit('message/SET_MESSAGE', data.payload, { root: true })
    }

    if (data.type === 'message-deleted') {
      this.commit('message/REMOVE_MESSAGE', data.payload, { root: true })
    }

    if (data.type === 'conversation-created') {
      this.commit('message/ADD_CONVERSATION', data.payload, { root: true })

      this.$eventBus.$emit('CONVERSATION_CREATED', data.payload)
    }

    if (data.type === 'conversation-renamed') {
      this.commit('message/RENAME_CONVERSATION', data.payload, { root: true })

      this.$eventBus.$emit('CONVERSATION_RENAMED', data.payload)
    }

    if (data.type === 'conversation-removed') {
      this.commit('message/REMOVE_CONVERSATION', data.payload, { root: true })

      this.$eventBus.$emit('CONVERSATION_REMOVED', data.payload)
    }

    if (data.type === 'acknowledged') {
      this.commit('message/UPDATE_MESSAGES', data.payload, { root: true })
    }

    if (data.type === 'member-added') {
      this.commit('message/ADD_MEMBER', data.payload, { root: true })
    }

    if (data.type === 'member-removed') {
      this.commit('message/REMOVE_MEMBER', data.payload, { root: true })
    }

    if (data.type === 'moderator-added') {
      this.commit('message/MODERATOR_ADDED', data.payload, { root: true })
    }

    if (data.type === 'moderator-removed') {
      this.commit('message/MODERATOR_REMOVED', data.payload, { root: true })
    }

    if (data.type === 'friendship-accepted') {
      this.commit('message/ADD_FRIEND', data.payload, { root: true })
    }

    if (data.type === 'friendship-removed') {
      this.commit('message/REMOVE_FRIEND', data.payload, { root: true })
    }

    if (data.type === 'friendship-requested') {
      this.commit('message/ADD_FRIEND_REQUEST', data.payload, { root: true })
    }

    if (data.type === 'friendship-rejected') {
      this.commit('message/REMOVE_FRIEND_REQUEST', data.payload, { root: true })
    }

    if (data.type === 'user-blocked') {
      this.commit('message/BLOCK_USER', data.payload, { root: true })
    }

    if (data.type === 'user-unblocked') {
      this.commit('message/UNBLOCK_USER', data.payload, { root: true })
    }
  },

  SOCKET_ONERROR (state, event) {
    console.log('Error connecting to websocket')
  },

  SOCKET_RECONNECT (state, count) {
    console.log('Reconnected to websocket')
  },

  SOCKET_RECONNECT_ERROR (state) {
    state.socket.reconnectError = true
  }
}

export const actions = {
  async fetchSettings ({ commit }) {
    const settings = await this.$API.call('settings')

    commit('SET_SETTINGS', settings)
  },

  async fetchHivePrice ({ commit }) {
    try {
      const result = await this.$axios.$get('https://api.coingecko.com/api/v3/simple/price?ids=HIVE&vs_currencies=USD')

      if (result) {
        commit('SET_HIVE_PRICE', result.hive.usd)
      }
    } catch {
      //
    }
  },

  requestCustomJson ({ rootState, commit }, json) {
    const { username } = rootState.user

    const client = this.$HIVE.getClient()

    if (rootState.user.smartLock) {
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

              const broadcast = await client.broadcast.json({
                required_auths: [username],
                required_posting_auths: [],
                id: json.id,
                json: JSON.stringify(json.data)
              }, privateKey)

              console.log(broadcast)

              if (json.eventName) {
                this.$eventBus.$emit(json.eventName, json.emitData || broadcast)
              }

              if (json.mutation) {
                commit(json.mutation)
              }
            } catch (e) {
              console.log(e.message)
            }
          }
        })
        .catch((e) => {
          console.log(e.message)
        })
    } else {
      window.hive_keychain.requestCustomJson(username, json.id, json.key, JSON.stringify(json.data), json.message, (r) => {
        if (r.success) {
          console.log(r)

          if (json.eventName) {
            this.$eventBus.$emit(json.eventName, json.emitData || r.result)
          }

          if (json.mutation) {
            commit(json.mutation)
          }
        }
      })
    }
  },

  wsSendMessage (context, message) {
    Vue.prototype.$socket.send(JSON.stringify(message))
  },

  async nuxtServerInit ({ dispatch }) {
    await dispatch('fetchSettings')
  }
}
