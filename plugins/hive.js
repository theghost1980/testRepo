import { Asset, Client, PrivateKey, PublicKey, cryptoUtils, utils } from '@hiveio/dhive'

export default ({ store }, inject) => {
  const client = new Client(store.state.settings.nodes, { failoverThreshold: 20, consoleOnFailover: true })

  const getClient = () => client

  const hive = {
    Asset,
    Client,
    PrivateKey,
    PublicKey,
    cryptoUtils,
    ...utils,
    getClient
  }

  inject('HIVE', hive)
}
