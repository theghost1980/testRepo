<template>
  <div class="mb-3 pb-2 border-bottom">
    <template v-if="transaction.type === 'buy'">
      <nuxt-link
        :to="{name:'user-collection', params:{user: transaction.account}}"
      >
        @{{ transaction.account }}
      </nuxt-link>
      bought edition #{{ transaction.data.edition }} from
      <nuxt-link
        :to="{name:'user-collection', params:{user: transaction.data.seller}}"
      >
        @{{ transaction.data.seller }}
      </nuxt-link>
      for {{ parseFloat(transaction.data.price).toFixed(3) }} {{ transaction.data.symbol }}
    </template>

    <template v-if="transaction.type === 'transfer'">
      <nuxt-link
        :to="{name:'user-collection', params:{user: transaction.account}}"
      >
        @{{ transaction.account }}
      </nuxt-link>
      transferred edition #{{ transaction.data.edition }} to
      <nuxt-link
        :to="{name:'user-collection', params:{user: transaction.data.to}}"
      >
        @{{ transaction.data.to }}
      </nuxt-link>
    </template>

    <template v-if="transaction.type === 'sell'">
      <nuxt-link
        :to="{name:'user-collection', params:{user: transaction.account}}"
      >
        @{{ transaction.account }}
      </nuxt-link>
      listed edition #{{ transaction.data.edition }} for sale for {{ parseFloat(transaction.data.price).toFixed(3) }} {{ transaction.data.symbol }}
    </template>

    <template v-if="transaction.type === 'burn'">
      <nuxt-link
        :to="{name:'user-collection', params:{user: transaction.account}}"
      >
        @{{ transaction.account }}
      </nuxt-link>
      burned edition #{{ transaction.data.edition }}
    </template>

    <template v-if="transaction.type === 'issue'">
      <nuxt-link
        :to="{name:'user-collection', params:{user: transaction.account}}"
      >
        @{{ transaction.account }}
      </nuxt-link>
      tokenized {{ transaction.data.editions }} editions
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
  name: 'SeriesTransactionHistory',

  props: {
    transaction: { type: Object, required: true },
    admin: { type: Boolean, default: false }
  }
}
</script>

<style>
</style>
