export const actions = {
  requestMintTokens ({ rootState, dispatch }, { fee, payload }) {
    const json = {
      contractName: 'tokens',
      contractAction: 'transfer',
      contractPayload: {
        symbol: rootState.settings.currency,
        to: rootState.settings.account,
        quantity: fee.toString(),
        memo: JSON.stringify(payload)
      }
    }

    const jsonData = {
      id: rootState.settings.sidechain_id,
      key: 'Active',
      data: json,
      message: 'Issue Token',
      eventName: 'issue-tokens-successful'
    }

    dispatch('requestCustomJson', jsonData, { root: true })
  },

  async validateTransaction (context, trxId) {
    let trx = null
    let count = 0

    do {
      try {
        await this.$HIVE.sleep(5 * 1000)

        trx = await this.$API.call('transactions/find', { trx_id: trxId })
      } catch {
        //
      }

      count += 1
    } while (!trx && count < 6)

    if (trx) {
      this.$eventBus.$emit('issue-tokens-validated')
    } else {
      this.$eventBus.$emit('issue-tokens-not-validated')
    }
  }
}
