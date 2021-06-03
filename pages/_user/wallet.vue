<template>
  <div class="wallet">
    <div class="d-flex">
      <h1 class="h4">
        Hive-Engine Wallet
      </h1>

      <a id="popover-info-1" href class="d-inline-block ml-2" @click.prevent>
        <v-icon name="info" />
      </a>
    </div>

    <hr>

    <template v-if="loading">
      <Loading />
    </template>

    <template v-else>
      <b-table
        responsive
        striped
        hover
        :items="getHEWallet"
        :fields="walletFields"
      >
        <template #cell(actions)>
          <b-button
            variant="primary"
            @click.prevent="$bvModal.show('depositHEModal')"
          >
            Deposit
          </b-button>&nbsp;
          <b-button
            variant="primary"
            @click.prevent="$bvModal.show('withdrawHEModal')"
          >
            Withdraw
          </b-button>&nbsp;
          <a id="popover-info-2" href @click.prevent>
            <v-icon name="info" />
          </a>
        </template>
      </b-table>

      <b-popover
        target="popover-info-1"
        triggers="click"
        title="Blockchain Info"
      >
        <template #default>
          <p>
            NFTTunz is built on a layer 2 smart contract platform called Hive-Engine. To buy and sell on NFTTunz you will need SWAP.HIVE which is a Hive-Engine token backed 1:1 with HIVE. For more information please see the
            <nuxt-link :to="{ name: 'faq' }">
              FAQ
            </nuxt-link>.
          </p>
        </template>
      </b-popover>

      <b-popover
        target="popover-info-2"
        triggers="click"
        title="Hive-Engine Info"
      >
        <template #default>
          <p>
            Use the deposit button to import the desired amount of HIVE, it will automatically convert to SWAP.HIVE which is the currency used to buy and sell on NFTTunz.
          </p>

          <p>
            The withdraw button will convert your SWAP.HIVE back to HIVE and return it to your HIVE wallet.
          </p>

          <p>*There is a 1% fee when converting between HIVE and SWAP.HIVE</p>
        </template>
      </b-popover>
    </template>

    <b-modal id="depositHEModal">
      <template #modal-title>
        Deposit
      </template>

      <template #default>
        <b-form-group label="Current Balance">
          <div class="form-text">
            {{ currencyBalance }} {{ settings.currency }}
          </div>
        </b-form-group>

        <b-form-group label="Amount" label-for="depositHEAmount">
          <b-input-group append="HIVE">
            <b-form-input
              id="depositHEAmount"
              v-model.number="depositHEAmount"
              type="number"
              step="any"
              placeholder="100.000"
              required
            />
          </b-input-group>
        </b-form-group>
      </template>

      <template #modal-footer>
        <b-button
          variant="primary"
          :disabled="depositHEAmount <= 0"
          @click="requestHEDeposit(depositHEAmount)"
        >
          Deposit HIVE
        </b-button>
      </template>
    </b-modal>

    <b-modal id="withdrawHEModal">
      <template #modal-title>
        Withdraw
      </template>

      <template #default>
        <b-form-group label="Available Balance">
          <div class="form-text">
            <a
              href="#"
              @click.prevent="withdrawHEAmount = currencyBalance"
            >{{ currencyBalance }} {{ settings.currency }}</a>
          </div>
        </b-form-group>
        <b-form-group label="Amount" label-for="withdrawHEAmount">
          <b-input-group :append="settings.currency">
            <b-form-input
              id="withdrawHEAmount"
              v-model.number="withdrawHEAmount"
              type="number"
              step="any"
              placeholder="100.000"
              required
            />
          </b-input-group>
        </b-form-group>
      </template>

      <template #modal-footer>
        <b-button
          variant="primary"
          :disabled="
            withdrawHEAmount <= 0 || withdrawHEAmount > currencyBalance
          "
          @click="requestHEWithdrawal(withdrawHEAmount)"
        >
          Withdraw {{ settings.currency }}
        </b-button>
      </template>
    </b-modal>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'Wallet',

  middleware: 'authenticated',

  data () {
    return {
      depositHEAmount: 0,
      withdrawHEAmount: 0,
      currencyBalance: 0,

      walletFields: [
        { key: 'token', label: 'TOKEN' },
        { key: 'balance', label: 'BALANCE' },
        { key: 'actions', label: '' }
      ],
      dataLoaded: false
    }
  },

  async fetch () {
    this.loading = true

    await this.loadHEWallet()

    this.loading = false
  },

  computed: {
    ...mapGetters(['settings']),
    ...mapGetters('user', ['isAuthenticated', 'username', 'profile']),

    getWallet () {
      return [
        {
          token: this.settings.currency,
          balance: this.profile.balance
        }
      ]
    },

    getHEWallet () {
      return [
        {
          token: this.settings.currency,
          balance: this.currencyBalance
        }
      ]
    }
  },

  mounted () {
    const self = this

    this.$eventBus.$on(['he-deposit-request-successful', 'he-withdrawal-request-successful'], async () => {
      self.$bvModal.hide('depositHEModal')
      self.$bvModal.hide('withdrawHEModal')

      this.loading = true

      await self.sleep(10 * 1000)

      await self.$fetch()
    })

    this.$root.$on('bv::modal::show', async (bvEvent, modalId) => {
      if (modalId === 'depositModal') {
        const [query] = await this.$sidechain.getBalances(self.username, self.settings.currency)
        self.currencyBalance = query ? Number(query.balance) : 0
      }
    })
  },

  beforeDestroy () {
    this.$eventBus.$off(['he-deposit-request-successful', 'he-withdrawal-request-successful'])
  },

  methods: {
    ...mapActions('user', ['requestHEDeposit', 'requestHEWithdrawal']),

    async loadHEWallet () {
      const [query] = await this.$sidechain.getBalances(this.username, this.settings.currency)
      this.currencyBalance = query ? Number(query.balance) : 0
    }
  }
}
</script>

<style lang="scss">
</style>
