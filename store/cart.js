export const state = () => ({
  cart: []
})

export const getters = {
  cart: state => state.cart
}

export const mutations = {
  ADD_TO_CART: (state, data) => {
    state.cart.push(data)
  },

  REMOVE_FROM_CART: (state, data) => {
    const nft = state.cart.find(c => c.nft_id === data)
    state.cart.splice(state.cart.indexOf(nft), 1)
  },

  EMPTY_CART: (state) => {
    state.cart = []
  }
}

export const actions = {
  requestTransfer ({ state, rootState, dispatch }, { recipient, memo }) {
    const nfts = state.cart.filter(c => c.owner === rootState.user.username && !c.on_market)
      .map(c => c.nft_id.toString())

    const json = {
      contractName: 'nft',
      contractAction: 'transfer',
      contractPayload: {
        to: recipient,
        nfts: [
          { symbol: rootState.settings.nft_symbol, ids: nfts, memo }
        ]
      }
    }

    const jsonData = {
      id: rootState.settings.sidechain_id,
      key: 'Active',
      data: json,
      message: `Transfer NFT (${rootState.settings.nft_symbol})`,
      eventName: 'nft-transfer-successful',
      mutation: 'cart/EMPTY_CART'
    }

    dispatch('requestCustomJson', jsonData, { root: true })
  },

  requestSell ({ state, rootState, dispatch }, price) {
    const nfts = state.cart.filter(c => c.owner === rootState.user.username && !c.on_market)
      .map(c => c.nft_id.toString())

    const json = {
      contractName: 'nftmarket',
      contractAction: 'sell',
      contractPayload: {
        symbol: rootState.settings.nft_symbol,
        nfts,
        price: price.toString(),
        priceSymbol: rootState.settings.currency,
        fee: rootState.settings.market_fee
      }
    }

    const jsonData = {
      id: rootState.settings.sidechain_id,
      key: 'Active',
      data: json,
      message: `Sell NFT (${rootState.settings.nft_symbol})`,
      eventName: 'nft-sell-successful',
      mutation: 'cart/EMPTY_CART'
    }

    dispatch('requestCustomJson', jsonData, { root: true })
  },

  requestCancelSale ({ state, rootState, dispatch }) {
    const nfts = state.cart.filter(c => c.on_market && c.owner === rootState.user.username)
      .map(c => c.nft_id.toString())

    const json = {
      contractName: 'nftmarket',
      contractAction: 'cancel',
      contractPayload: {
        symbol: rootState.settings.nft_symbol,
        nfts
      }
    }

    const jsonData = {
      id: rootState.settings.sidechain_id,
      key: 'Active',
      data: json,
      message: `Cancel Sale NFT (${rootState.settings.nft_symbol})`,
      eventName: 'nft-cancel-sell-successful',
      mutation: 'cart/EMPTY_CART'
    }

    dispatch('requestCustomJson', jsonData, { root: true })
  },

  requestChangePrice ({ state, rootState, dispatch }, price) {
    const nfts = state.cart.filter(c => c.on_market && c.owner === rootState.user.username)
      .map(c => c.nft_id.toString())

    const json = {
      contractName: 'nftmarket',
      contractAction: 'changePrice',
      contractPayload: {
        symbol: rootState.settings.nft_symbol,
        nfts,
        price: price.toString()
      }
    }

    const jsonData = {
      id: rootState.settings.sidechain_id,
      key: 'Active',
      data: json,
      message: `Change Price NFT (${rootState.settings.nft_symbol})`,
      eventName: 'nft-change-price-successful',
      mutation: 'cart/EMPTY_CART'
    }

    dispatch('requestCustomJson', jsonData, { root: true })
  },

  requestBuy ({ state, rootState, dispatch }) {
    const nfts = state.cart.filter(c => c.owner !== rootState.user.username && c.on_market && c.price > 0)
      .map(c => c.nft_id.toString())

    const json = {
      contractName: 'nftmarket',
      contractAction: 'buy',
      contractPayload: {
        symbol: rootState.settings.nft_symbol,
        nfts,
        marketAccount: rootState.settings.account
      }
    }

    const jsonData = {
      id: rootState.settings.sidechain_id,
      key: 'Active',
      data: json,
      message: `Buy NFT (${rootState.settings.nft_symbol})`,
      eventName: 'nft-buy-successful',
      mutation: 'cart/EMPTY_CART'
    }

    dispatch('requestCustomJson', jsonData, { root: true })
  },

  requestBurn ({ state, rootState, dispatch }) {
    const nfts = state.cart.filter(c => c.owner === rootState.user.username && !c.on_market)
      .map(c => c.nft_id.toString())

    const json = {
      contractName: 'nft',
      contractAction: 'burn',
      contractPayload: {
        nfts: [
          { symbol: rootState.settings.nft_symbol, ids: nfts }
        ]
      }
    }

    const jsonData = {
      id: rootState.settings.sidechain_id,
      key: 'Active',
      data: json,
      message: `Burn NFT  (${rootState.settings.nft_symbol})`,
      eventName: 'nft-burn-successful',
      mutation: 'cart/EMPTY_CART'
    }

    dispatch('requestCustomJson', jsonData, { root: true })
  }
}
