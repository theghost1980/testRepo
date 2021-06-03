import { arrayChunk } from '@/helpers'

export const state = () => ({
  interests: [],
  market: [],
  series: [],
  nfts: [],
  history: [],
  trades_history: [],
  search_results: [],
  pagination: {
    limit: 30,
    page: 0,
    sort_by: 'newest',
    rights: null,
    category: null,
    price_min: '',
    price_max: '',
    has_more: true
  }
})

export const getters = {
  interests: state => state.interests,
  market: state => state.market,
  series: state => state.series,
  nfts: state => state.nfts,
  history: state => state.history,
  trades_history: state => state.trades_history,
  search_results: state => state.search_results,
  pagination: state => state.pagination
}

export const mutations = {
  SET_INTERESTS: (state, data) => {
    state.interests = data
  },

  SET_MORE_INTERESTS: (state, data) => {
    const interests = state.interests
    state.interests = [...interests, ...data]
  },

  SET_MARKET: (state, data) => {
    state.market = data
  },

  SET_SERIES: (state, data) => {
    state.series = data
  },

  SET_NFTS: (state, data) => {
    state.nfts = data
  },

  SET_HISTORY: (state, data) => {
    state.history = data
  },

  TRADES_HISTORY: (state, data) => {
    state.trades_history = data
  },

  SET_SEARCH_RESULTS: (state, data) => {
    state.search_results = data
  },

  SET_PAGINATION: (state, data) => {
    const pagination = state.pagination

    Object.keys(data).forEach((d) => {
      pagination[d] = data[d]
    })

    state.pagination = pagination
  }
}

export const actions = {
  async fetchInterests ({ commit, state }, infinity = false) {
    try {
      const {
        page,
        limit,
        sort_by: sortBy,
        has_more: hasMore,
        price_min: priceMin,
        price_max: priceMax,
        rights,
        category
      } = state.pagination

      if (hasMore) {
        const params = { page: page + 1, limit, sort_by: sortBy }

        if (priceMin) { params.price_min = priceMin }
        if (priceMax) { params.price_max = priceMax }
        if (rights) { params.rights = rights }
        if (category) { params.category = category }

        const interests = await this.$API.call('market', params)

        if (interests.length > 0) {
          if (infinity) {
            commit('SET_MORE_INTERESTS', interests)
          } else {
            commit('SET_INTERESTS', interests)
          }

          commit('SET_PAGINATION', { page: page + 1 })
        } else {
          if (page === 0) { commit('SET_INTERESTS', interests) }

          commit('SET_PAGINATION', { has_more: false })
        }
      }
    } catch (e) {
      console.log(e.message)
    }
  },

  async fetchMarket ({ commit, dispatch, rootState }, query) {
    try {
      const limit = 1000
      let market = []
      let newData = 0
      let offset = 0

      do {
        const data = await this.$sidechain.getNFTSellBook(query, offset, limit)
        newData = data.length

        if (data.length > 0) {
          market.push(...data)

          if (data.length < limit) {
            newData = 0
          }
        }
        offset += 1000
      } while (newData > 0)

      market = market.map(c => ({
        account: c.account,
        nft_id: Number(c.nftId),
        series: c.grouping.series,
        price: Number(c.price),
        symbol: c.priceSymbol,
        fee: c.fee
      }))

      commit('SET_MARKET', market)

      const nftsIds = market.map(m => m.nft_id)
      const seriesNames = query['grouping.series']

      await Promise.all([
        dispatch('fetchNfts', nftsIds),
        dispatch('fetchSeries', seriesNames)
      ])
    } catch (e) {
      console.log(e.message)
    }
  },

  async fetchSeries ({ commit }, seriesNames) {
    let seriesData = {}

    if (Array.isArray(seriesNames)) {
      const promises = []

      const chunks = arrayChunk(seriesNames, 500)

      for (let i = 0; i < chunks.length; i += 1) {
        promises.push(this.$API.$post('collectibles/info', { series: chunks[i].toString() }))
      }

      seriesData = (await Promise.all(promises)).flat(Infinity)
    } else {
      seriesData = await this.$API.call('collectibles/info', { series: seriesNames })
    }

    commit('SET_SERIES', seriesData)
  },

  async fetchNfts ({ commit }, nftsIds) {
    try {
      let nfts = await this.$sidechain.getNFTInstances({ _id: { $in: nftsIds } })

      nfts = nfts.map(n => ({
        // eslint-disable-next-line no-underscore-dangle
        nft_id: n._id,
        ...n.properties
      }))

      commit('SET_NFTS', nfts)
    } catch (e) {
      console.log(e.message)
    }
  },

  async fetchTradesHistory ({ state, commit, dispatch }, limit) {
    try {
      let trades = await this.$API.call('transactions/history', { types: 'buy', limit })

      trades = trades.map(t => ({ ...t, data: JSON.parse(t.data) }))

      const uniqueSeries = Array.from(new Set(trades.map(t => t.data.series)))

      await dispatch('fetchSeries', uniqueSeries)

      const tradeHistory = trades.map((n) => {
        const series = state.series.find(s => s.series === n.series)

        return {
          ...n,
          ...n.data,
          buyer: n.account,
          seller: n.data.seller,
          name: series.name,
          file: series.file,
          thumbnail: series.thumbnail,
          series: n.series,
          nsfw: series.nsfw
        }
      })

      commit('TRADES_HISTORY', tradeHistory)
    } catch (e) {
      console.log(e.message)
    }
  },

  async fetchCollectibleHistory ({ commit }, series) {
    try {
      let history = await this.$API.call('transactions/history', { series, types: 'issue,buy,burn' })

      history = history.map(h => ({ ...h, data: JSON.parse(h.data) }))

      commit('SET_HISTORY', history)
    } catch (e) {
      console.log(e.message)
    }
  },

  async fetchSearchResults ({ commit }, query) {
    try {
      const search = await this.$API.$post('search', { q: query })

      commit('SET_SEARCH_RESULTS', search)
    } catch (e) {
      console.log(e.message)
    }
  },

  requestReportCollectible ({ rootState, dispatch }, data) {
    const jsonData = {
      id: `${rootState.settings.prefix}_report_collectible`,
      key: 'Posting',
      data,
      message: 'Report',
      eventName: 'REPORT_COLLECTIBLE_SUCCESSFUL'
    }

    dispatch('requestCustomJson', jsonData, { root: true })
  }
}
