import { arrayChunk } from '@/helpers'

export const state = () => ({
  collection: [],
  on_market: [],
  series: [],
  collectibles: [],
  latest: [],
  featured: []
})

export const getters = {
  collection: state => state.collection,
  on_market: state => state.on_market,
  series: (state) => {
    if (Array.isArray(state.series)) {
      const rawSeries = state.series.slice()

      return rawSeries.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    }
    return state.series
  },
  collectibles: state => state.collectibles,
  latest: state => state.latest,
  featured: state => state.featured
}

export const mutations = {
  SET_COLLECTION: (state, data) => {
    state.collection = data
  },

  SET_ON_MARKET: (state, data) => {
    state.on_market = data
  },

  SET_SERIES: (state, data) => {
    state.series = data
  },

  SET_COLLECTIBLES: (state, data) => {
    state.collectibles = data
  },

  SET_LATEST: (state, data) => {
    state.latest = data
  },

  SET_FEATURED: (state, data) => {
    state.featured = data
  }
}

export const actions = {
  async fetchCollection ({ commit, dispatch, rootState }, query) {
    try {
      let collection = await this.$sidechain.getNFTInstances(query)

      collection = collection.map(c => ({
        // eslint-disable-next-line no-underscore-dangle
        nft_id: c._id,
        account: c.account,
        ...c.properties
      }))

      commit('SET_COLLECTION', collection)

      const seriesNames = query['properties.series']
        ? query['properties.series']
        : Array.from(new Set(collection.map(c => c.series)))

      await dispatch('fetchSeries', seriesNames)
    } catch (e) {
      console.log(e.message)
    }
  },

  async fetchOnMarket ({ commit, dispatch }, query) {
    try {
      let market = await this.$sidechain.getNFTSellBook(query)

      market = market.map(c => ({
        account: c.account,
        nft_id: Number(c.nftId),
        series: c.grouping.series,
        price: Number(c.price),
        symbol: c.priceSymbol,
        fee: c.fee
      }))

      commit('SET_ON_MARKET', market)

      const seriesNames = Array.from(new Set(market.map(c => c.series)))

      await dispatch('fetchSeries', seriesNames)
    } catch (e) {
      console.log(e.message)
    }
  },

  async fetchSeries ({ commit, state }, seriesNames) {
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

  async fetchCollectibles ({ commit, rootState }) {
    const data = await this.$API.call('collectibles/list', { username: rootState.user.username })

    const collectibles = data.map(a => ({
      collection_name: a.collection_name,
      name: a.name,
      series: a.series
    }))

    commit('SET_COLLECTIBLES', collectibles)
  },

  async fetchAllCollectibles ({ commit }, username) {
    const seriesData = await this.$API.call('collectibles/list', { username, published: true })

    commit('SET_SERIES', seriesData)
  },

  async fetchLatestCollectibles ({ commit }, limit = 3) {
    const data = await this.$API.call('collectibles/latest', { limit })

    commit('SET_LATEST', data)
  },

  async fetchFeaturedCollectibles ({ commit }) {
    const data = await this.$API.call('collectibles/featured')

    commit('SET_FEATURED', data)
  }
}
