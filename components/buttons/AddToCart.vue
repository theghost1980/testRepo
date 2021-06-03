<template>
  <div v-if="username === owner || onMarket" class="add-to-cart">
    <template v-if="cartItemExist(nftId)">
      <b-button
        title="Use SHIFT + CLICK to remove multiple items"
        size="sm"
        variant="danger"
        block
        @click="removeFromCart(nftId, $event)"
      >
        <v-icon name="shopping-cart" />&nbsp;Added
      </b-button>
    </template>
    <template v-else>
      <b-button
        :title="!isAuthenticated ? 'Please login to use this function.' : 'Use SHIFT + CLICK to add multiple items'"
        size="sm"
        variant="primary"
        block
        :disabled="maximumQuantityReached() || disabled || !isAuthenticated"
        @click="addToCart({
          nft_id: nftId,
          series: series,
          edition: edition,
          name: name,
          image: image,
          price,
          owner,
          on_market: onMarket }, $event)"
      >
        <template v-if="username === owner">
          Manage
        </template>

        <template v-else-if="username !== owner && onMarket">
          Buy It
        </template>
      </b-button>
    </template>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'

export default {
  name: 'AddToCart',
  props: {
    nftId: { type: Number, required: true },
    series: { type: String, required: true },
    edition: { type: Number, default: 0 },
    name: { type: String, default: '' },
    image: { type: String, default: '' },
    price: { type: Number, default: 0 },
    onMarket: { type: Boolean },
    owner: { type: String, default: '' },
    collection: { type: Array, required: true },
    disabled: { type: Boolean }
  },
  computed: {
    ...mapGetters('cart', ['cart']),
    ...mapGetters('user', ['isAuthenticated', 'username'])
  },
  methods: {
    ...mapMutations('cart', ['ADD_TO_CART', 'REMOVE_FROM_CART']),

    cartItemExist (nftId) {
      return this.cart.some(p => p.nft_id === nftId)
    },

    maximumQuantityReached () {
      return this.cart.length >= 50
    },

    addToCart (data, event) {
      const self = this

      if (event.shiftKey) {
        const lastAdded = this.cart.filter(c => c.series === this.series)

        if (lastAdded.length <= 0) { this.ADD_TO_CART(data) }

        const lastItem = lastAdded[lastAdded.length - 1] || data
        const lastIndex = this.collection.findIndex(c => c.nft_id === lastItem.nft_id)
        const currentIndex = this.collection.findIndex(c => c.nft_id === data.nft_id)

        const start = (lastIndex > currentIndex) ? currentIndex : lastIndex + 1
        const end = (lastIndex > currentIndex) ? lastIndex : currentIndex + 1

        this.collection.slice(start, end).forEach((c) => {
          if (!self.maximumQuantityReached()) {
            self.ADD_TO_CART({
              nft_id: c.nft_id,
              series: c.series,
              edition: c.edition,
              name: self.name,
              image: self.image,
              price: c.price || 0,
              owner: self.owner,
              on_market: self.onMarket
            })
          }
        })
      } else {
        this.ADD_TO_CART(data)
      }
    },

    removeFromCart (nftId, event) {
      const self = this

      if (event.shiftKey) {
        const lastAdded = this.cart.filter(c => c.series === this.series)

        if (lastAdded.length > 0) { this.REMOVE_FROM_CART(lastAdded[lastAdded.length - 1].nft_id) }

        const lastItem = lastAdded[lastAdded.length - 1] || { nft_id: nftId }
        const lastIndex = this.collection.findIndex(c => c.nft_id === lastItem.nft_id)
        const currentIndex = this.collection.findIndex(c => c.nft_id === nftId)

        const start = (lastIndex > currentIndex) ? currentIndex : lastIndex + 1
        const end = (lastIndex > currentIndex) ? lastIndex : currentIndex + 1

        this.collection.slice(start, end).forEach((c) => {
          self.REMOVE_FROM_CART(c.nft_id)
        })
      } else {
        this.REMOVE_FROM_CART(nftId)
      }
    }
  }
}
</script>

<style>
.add-to-cart {
  width: 90px;
  float: right;
  clear: both;
}
</style>
