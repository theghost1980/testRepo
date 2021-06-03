<template>
  <div class="mb-3 pb-2 border-bottom">
    <template v-if="admin">
      <nuxt-link :to="{name:'user-collection', params:{user: username}}">
        @{{ username }}
      </nuxt-link>
    </template>
    <template v-else>
      You
    </template>

    <template v-if="transaction.type === 'buy'">
      <template v-if="transaction.account === username">
        bought edition #{{ transaction.data.edition }} of
        <nuxt-link
          :to="{name: 'gallery-collectible', params: {collectible: transaction.series}}"
        >
          {{ transaction.series }}
        </nuxt-link>from
        <nuxt-link
          :to="{name:'user-collection', params:{user: transaction.data.seller}}"
        >
          @{{ transaction.data.seller }}
        </nuxt-link>
        for {{ parseFloat(transaction.data.price).toFixed(3) }} {{ transaction.data.symbol }}
      </template>

      <template v-if="transaction.counterparty === username">
        sold edition #{{ transaction.data.edition }} of
        <nuxt-link
          :to="{name: 'gallery-collectible', params: {collectible: transaction.series}}"
        >
          {{ transaction.series }}
        </nuxt-link>to
        <nuxt-link
          :to="{name:'user-collection', params:{user: transaction.account}}"
        >
          @{{ transaction.account }}
        </nuxt-link>
        for {{ parseFloat(transaction.data.price).toFixed(3) }} {{ transaction.data.symbol }}
      </template>
    </template>

    <template v-if="transaction.type === 'transfer'">
      <template v-if="transaction.account === username">
        gifted edition #{{ transaction.data.edition }} of
        <nuxt-link
          :to="{name: 'gallery-collectible', params: {collectible: transaction.series}}"
        >
          {{ transaction.series }}
        </nuxt-link>to
        <nuxt-link
          :to="{name:'user-collection', params:{user: transaction.data.to}}"
        >
          @{{ transaction.data.to }}
        </nuxt-link>
      </template>

      <template v-if="transaction.counterparty === username">
        received a gift edition #{{ transaction.data.edition }} of
        <nuxt-link
          :to="{name: 'gallery-collectible', params: {collectible: transaction.series}}"
        >
          {{ transaction.series }}
        </nuxt-link>from
        <nuxt-link
          :to="{name:'user-collection', params:{user: transaction.data.from}}"
        >
          @{{ transaction.data.from }}
        </nuxt-link>
      </template>
    </template>

    <template v-if="transaction.type === 'sell'">
      listed edition #{{ transaction.data.edition }} of
      <nuxt-link
        :to="{name: 'gallery-collectible', params: {collectible: transaction.series}}"
      >
        {{ transaction.series }}
      </nuxt-link>
      for sale for {{ parseFloat(transaction.data.price).toFixed(3) }} {{ transaction.data.symbol }}
    </template>

    <template v-if="transaction.type === 'issue'">
      tokenized {{ transaction.data.editions }} editions of
      <nuxt-link
        :to="{name: 'gallery-collectible', params: {collectible: transaction.series}}"
      >
        {{ transaction.series }}
      </nuxt-link>
    </template>

    <template v-if="transaction.type === 'change_price'">
      changed price of edition #{{ transaction.data.edition }} of
      <nuxt-link
        :to="{name: 'gallery-collectible', params: {collectible: transaction.series}}"
      >
        {{ transaction.series }}
      </nuxt-link>
      to {{ parseFloat(transaction.data.new_price).toFixed(3) }} {{ transaction.data.symbol }}
    </template>

    <template v-if="transaction.type === 'cancel_sale'">
      removed edition #{{ transaction.data.edition }} of
      <nuxt-link
        :to="{name: 'gallery-collectible', params: {collectible: transaction.series}}"
      >
        {{ transaction.series }}
      </nuxt-link>from market
    </template>

    <template v-if="transaction.type === 'burn'">
      burned edition #{{ transaction.data.edition }} of
      <nuxt-link
        :to="{name: 'gallery-collectible', params: {collectible: transaction.series}}"
      >
        {{ transaction.series }}
      </nuxt-link>
    </template>

    <template v-if="transaction.type === 'royalty_payment'">
      received {{ transaction.data.amount }} {{ transaction.data.symbol }} royalty payment for edition #{{ transaction.data.edition }} of
      <nuxt-link
        :to="{name: 'gallery-collectible', params: {collectible: transaction.series}}"
      >
        {{ transaction.series }}
      </nuxt-link>
    </template>

    <template v-if="transaction.type === 'referral_bonus'">
      received {{ transaction.data.amount }} {{ transaction.data.symbol }} referral bonus for
      <nuxt-link
        :to="{name: 'gallery-collectible', params: {collectible: transaction.series}}"
      >
        {{ transaction.series }}
      </nuxt-link>
    </template>
    <br>
    <timeago class="text-muted" :datetime="new Date(transaction.timestamp)" :auto-update="60" />
    <a
      class="small"
      :href="`${(transaction.sidechain_block) ? $config.EXPLORER_URL: 'https://hiveblocks.com'}/tx/${transaction.trx_id}`"
      target="_blank"
    >[view tx]</a>
  </div>
</template>

<script>
export default {
  name: 'TransactionHistory',

  props: {
    username: { type: String, required: true },
    transaction: { type: Object, required: true },
    admin: { type: Boolean, default: false }
  }
}
</script>

<style>
</style>
