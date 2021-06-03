<template>
  <div>
    <b-modal
      id="activityModal"
      centered
      scrollable
      no-stacking
      size="lg"
      title="Activities"
      header-bg-variant="dark"
      header-text-variant="light"
    >
      <template #default>
        <template v-if="cart.length === 0">
          No item found!
        </template>
        <template v-else>
          <table id="cartTable" class="table">
            <tr v-for="(nft, i) of cart" :key="i">
              <td>
                <b-avatar square size="80px">
                  <v-icon name="activity" />
                </b-avatar>
              </td>
              <td>
                <strong>{{ nft.name }}</strong>
                <br>
                <span class="text-muted small">
                  <template v-if="nft.edition">
                    <strong>Edition #</strong>
                    {{ nft.edition }}
                  </template>
                  <template v-if="nft.owner">
                    <strong>Owner:</strong>
                    {{ nft.owner }}
                  </template>
                  <strong>Series:</strong>
                  {{ nft.series }}
                </span>
              </td>
              <td class="text-right">
                {{
                  nft.price > 0
                    ? `${nft.price} ${settings.currency}
                (${getUSDPrice(nft.price)})`
                    : "&nbsp;"
                }}
                <br>
                <a
                  href="#"
                  title="Remove"
                  class="text-danger"
                  @click.prevent="REMOVE_FROM_CART(nft.nft_id)"
                >
                  <v-icon name="x" />
                </a>
              </td>
            </tr>
          </table>
        </template>
      </template>
      <template #modal-footer>
        <b-button
          variant="danger"
          :disabled="disableSellAndTransfer"
          @click.prevent="$bvModal.show('burnModal')"
        >
          Burn
        </b-button>

        <b-button
          variant="info"
          :disabled="disableSellAndTransfer"
          @click.prevent="$bvModal.show('sellModal')"
        >
          Sell
        </b-button>

        <b-button
          variant="info"
          :disabled="disableCancelSaleAndChangePrice"
          @click.prevent="$bvModal.show('changePriceModal')"
        >
          Change Price
        </b-button>

        <b-button
          variant="info"
          :disabled="disableCancelSaleAndChangePrice"
          @click.prevent="cancelSaleNFT"
        >
          Cancel Sale
        </b-button>

        <b-button
          variant="info"
          :disabled="disableSellAndTransfer"
          @click.prevent="$bvModal.show('transferModal')"
        >
          Transfer
        </b-button>

        <b-button
          variant="info"
          :disabled="disableBuy"
          @click.prevent="$bvModal.show('buyModal')"
        >
          Buy
        </b-button>
      </template>
    </b-modal>

    <b-modal id="sellModal" centered title="Sell NFT">
      <b-form-group
        description="Enter the amount you want to sell each individual NFTs for"
        label="Price"
        label-for="price"
      >
        <b-input-group :append="settings.currency">
          <b-form-input
            id="price"
            v-model.number="price"
            type="number"
            trim
            :state="$v.price.$dirty ? !$v.price.$error : null"
          />
        </b-input-group>
      </b-form-group>

      <template #modal-footer>
        <b-button variant="info" :disabled="price < 0" @click.prevent="sellNFT">
          Sell
        </b-button>
      </template>
    </b-modal>

    <b-modal id="changePriceModal" centered title="Change Price">
      <b-form-group
        description="Enter the amount you want to sell each individual NFTs for"
        label="New Price"
        label-for="newPrice"
      >
        <b-input-group :append="settings.currency">
          <b-form-input
            id="newPrice"
            v-model.number="newPrice"
            type="number"
            trim
            :state="$v.newPrice.$dirty ? !$v.newPrice.$error : null"
          />
        </b-input-group>
      </b-form-group>

      <template #modal-footer>
        <b-button
          variant="info"
          :disabled="newPrice < 0"
          @click.prevent="changeSellPrice"
        >
          Change Price
        </b-button>
      </template>
    </b-modal>

    <b-modal id="transferModal" centered title="Transfer NFT">
      <b-form-group
        description="Enter HIVE username of the recipient"
        label="Recipient *"
        label-for="recipient"
      >
        <b-input-group prepend="@">
          <b-form-input
            id="recipient"
            v-model="$v.recipient.$model"
            trim
            :state="$v.recipient.$dirty ? !$v.recipient.$error : null"
          />
        </b-input-group>
      </b-form-group>

      <b-form-group
        description="A custom gift message to the recipient."
        label="Memo"
        label-for="memo"
      >
        <b-form-textarea id="memo" v-model="memo" trim />
      </b-form-group>

      <template #modal-footer>
        <b-button
          variant="info"
          :disabled="recipient.length < 3"
          @click.prevent="transferNFT"
        >
          Transfer
        </b-button>
      </template>
    </b-modal>

    <b-modal id="buyModal" centered title="Buy NFT">
      <p>You are about to buy the following NFTs:</p>
      <table class="table">
        <tr v-for="(n, i) of avilableForBuy" :key="i">
          <td>
            <b-avatar square size="80px">
              <v-icon name="activity" />
            </b-avatar>
          </td>
          <td>
            {{ n.name }}
            <br>
            {{ n.price }} {{ settings.currency }}
          </td>
        </tr>
      </table>
      <p>Total Price: {{ calculateTotal }} {{ settings.currency }}</p>
      <p>Your Balance: {{ currencyBalance }} {{ settings.currency }}</p>

      <template #modal-footer>
        <b-button
          variant="info"
          :disabled="calculateTotal > currencyBalance"
          @click.prevent="buyNFT"
        >
          Buy
        </b-button>
      </template>
    </b-modal>

    <b-modal id="burnModal" centered title="Burn NFT">
      <p>You are about to burn the following NFTs:</p>
      <table class="table">
        <tr v-for="(n, i) of avilableForTransferSaleBurn" :key="i">
          <td>
            <b-avatar square size="80px">
              <v-icon name="activity" />
            </b-avatar>
          </td>
          <td>
            {{ n.name }}
            <br>
            Edition # {{ n.edition }}
          </td>
        </tr>
      </table>
      <p class="text-danger">
        Please note that this action is irreversible.
      </p>
      <template #modal-footer>
        <b-button variant="danger" @click.prevent="burnNFT">
          Burn
        </b-button>
      </template>
    </b-modal>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex'
import { required, minLength, maxLength, maxValue } from 'vuelidate/lib/validators'

export default {
  name: 'ActivityModal',

  data () {
    return {
      recipient: '',
      memo: '',
      price: 0,
      newPrice: 0,
      currencyBalance: 0
    }
  },

  computed: {
    ...mapGetters(['settings', 'hive_price']),
    ...mapGetters('user', ['username']),
    ...mapGetters('cart', ['cart']),

    disableBuy () {
      const self = this
      return this.cart.every(c => c.owner === self.username || c.on_market === false)
    },

    disableSellAndTransfer () {
      const self = this
      return this.cart.every(c => c.owner !== self.username || c.on_market === true)
    },

    disableCancelSaleAndChangePrice () {
      const self = this
      return this.cart.every(c => c.owner !== self.username || c.on_market === false)
    },

    calculateTotal () {
      return this.cart.reduce((acc, cur) => acc + cur.price, 0)
    },

    avilableForTransferSaleBurn () {
      const self = this
      return this.cart.filter(c => c.owner === self.username && c.on_market === false)
    },

    avilableForBuy () {
      const self = this
      return this.cart.filter(c => c.owner !== self.username && c.on_market === true)
    }
  },

  validations: {
    recipient: {
      required,
      minLength: minLength(3),
      maxLength: maxLength(16),
      validUsername: (value) => {
        if (value === '') { return true }

        return /^([a-z])[a-z0-9-.]*$/.test(value)
      }
    },

    price: {
      required,
      maxValue: maxValue(Number.MAX_SAFE_INTEGER)
    },

    newPrice: {
      required,
      maxValue: maxValue(Number.MAX_SAFE_INTEGER)
    }
  },

  mounted () {
    const self = this

    this.$root.$on('bv::modal::show', async (bvEvent, modalId) => {
      if (modalId === 'buyModal') {
        const [query] = await this.$sidechain.getBalances(self.username, self.settings.currency)
        self.currencyBalance = query ? Number(query.balance) : 0
      }
    })
  },

  beforeDestroy () {
    this.$root.$off('bv::modal::show')
  },

  methods: {
    ...mapMutations('cart', ['REMOVE_FROM_CART']),
    ...mapActions('cart', ['requestTransfer', 'requestSell', 'requestBuy', 'requestBurn', 'requestCancelSale', 'requestChangePrice']),

    transferNFT () {
      this.$v.recipient.$touch()

      if (!this.$v.recipient.$invalid) {
        this.$bvModal.hide('transferModal')
        return this.requestTransfer({ recipient: this.recipient, memo: this.memo })
      }
    },

    changeSellPrice () {
      this.$v.newPrice.$touch()

      if (!this.$v.newPrice.$invalid) {
        this.$bvModal.hide('changePriceModal')
        return this.requestChangePrice(this.newPrice)
      }
    },

    sellNFT () {
      this.$v.price.$touch()

      if (!this.$v.price.$invalid) {
        this.$bvModal.hide('sellModal')
        return this.requestSell(this.price)
      }
    },

    cancelSaleNFT () {
      this.$bvModal.hide('activityModal')
      return this.requestCancelSale()
    },

    buyNFT () {
      this.$bvModal.hide('buyModal')
      return this.requestBuy()
    },

    burnNFT () {
      this.$bvModal.hide('burnModal')
      return this.requestBurn()
    },

    getUSDPrice (hivePrice) {
      return `$${Number(Number(hivePrice) * this.hive_price).toFixed(3)}`
    }
  }
}
</script>

<style>
</style>
