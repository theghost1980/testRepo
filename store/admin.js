export const state = () => ({
  whitelist_applications: [],
  reports: [],
  history: [],
  statistics: []
})

export const getters = {
  whitelistApplications: state => state.whitelist_applications.map(a => ({
    username: a.username,
    bio: a.bio,
    location: a.location,
    social_profiles: {
      website: a.website,
      portfolio: a.portfolio,
      instagram: a.instagram,
      twitter: a.twitter,
      soundcloud: a.soundcloud
    }
  })),
  reports: state => state.reports,
  history: state => state.history,
  statistics: state => state.statistics
}

export const mutations = {
  SET_WHITELIST_APPLICATIONS: (state, data) => {
    state.whitelist_applications = data
  },

  SET_REPORTS: (state, data) => {
    state.reports = data
  },

  SET_HISTORY: (state, data) => {
    state.history = data
  },

  SET_STATISTICS: (state, data) => {
    state.statistics = data
  }
}

export const actions = {
  async fetchWhitelistApplications ({ commit }) {
    try {
      const data = await this.$API.call('admin/whitelist-applications')
      commit('SET_WHITELIST_APPLICATIONS', data)
    } catch (e) {
      console.log(e.message)
    }
  },

  async fetchReports ({ commit }) {
    try {
      const data = await this.$API.call('admin/reports')
      commit('SET_REPORTS', data)
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

  async fetchCollectibleHistory ({ commit }, { series, types = 'issue,buy' }) {
    try {
      let history = await this.$API.call('transactions/history', { series, types })

      history = history.map(h => ({ ...h, data: JSON.parse(h.data) }))

      commit('SET_HISTORY', history)
    } catch (e) {
      console.log(e.message)
    }
  },

  async fetchStatistics ({ commit }, days) {
    try {
      let stats = await this.$API.call('statistics', { days })

      stats = stats.map(h => ({ ...h, timestamp: new Date(h.timestamp) }))

      commit('SET_STATISTICS', stats)
    } catch (e) {
      console.log(e.message)
    }
  },

  async requestProcessApplication ({ state, commit }, { username, action, value }) {
    try {
      const { success } = await this.$API.$post('admin/whitelist', { username, action, value })

      if (success) {
        let applications = JSON.parse(JSON.stringify(state.whitelist_applications))

        applications = applications.reduce((acc, cur) => {
          if (cur.username === username) {
            if (action === 'approve') {
              cur.whitelisted = value
              cur.application_pending = false

              if (!value) {
                cur.whitelist_applied = false
              }
            } else if (action === 'pending') {
              cur.application_pending = value
            }
          }

          acc.push(cur)

          return acc
        }, [])
          .filter(w => !w.whitelisted && w.whitelist_applied)

        commit('SET_WHITELIST_APPLICATIONS', applications)
      }
    } catch (e) {
      console.log(e.message)
    }
  },

  requestProcessReport ({ rootState, dispatch }, data) {
    const jsonData = {
      id: `${rootState.settings.prefix}_process_report`,
      key: 'Active',
      data,
      message: 'Process Report',
      eventName: 'COLLECTIBLE_REPORT_PROCESSED',
      emitData: data
    }

    dispatch('requestCustomJson', jsonData, { root: true })
  },

  requestManageUser ({ rootState, dispatch }, data) {
    const jsonData = {
      id: `${rootState.settings.prefix}_manage_user`,
      key: 'Active',
      data,
      message: 'Manage User',
      eventName: 'MANAGE_USER_PROCESSED',
      emitData: data
    }

    dispatch('requestCustomJson', jsonData, { root: true })
  },

  requestManageCollectible ({ rootState, dispatch }, data) {
    const jsonData = {
      id: `${rootState.settings.prefix}_manage_collectible`,
      key: 'Active',
      data,
      message: 'Manage Collectible',
      eventName: 'MANAGE_COLLECTIBLE_PROCESSED',
      emitData: data
    }

    dispatch('requestCustomJson', jsonData, { root: true })
  },

  requestFeatureCollectible ({ rootState, dispatch }, data) {
    const jsonData = {
      id: `${rootState.settings.prefix}_feature_collectible`,
      key: 'Active',
      data,
      message: 'Feature Collectible',
      eventName: 'FEATURE_COLLECTIBLE_PROCESSED',
      emitData: data
    }

    dispatch('requestCustomJson', jsonData, { root: true })
  },

  requestManualIssue ({ rootState, dispatch }, data) {
    const jsonData = {
      id: `${rootState.settings.prefix}_manual_issue`,
      key: 'Active',
      data,
      message: 'Manual Issue',
      eventName: 'MANUAL_ISSUE_PROCESSED',
      emitData: data
    }

    dispatch('requestCustomJson', jsonData, { root: true })
  }
}
