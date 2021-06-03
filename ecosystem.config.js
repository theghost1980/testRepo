module.exports = {
  apps: [{
    name: 'nfttunz-frontend',
    script: './node_modules/nuxt/bin/nuxt.js',
    watch: false,
    args: 'start',
    env_production: {
      NODE_ENV: 'production',
      API_BASE_URL: 'https://nfttunz.io/api',
      CHAT_API: 'https://beechat.hive-engine.com/api',
      CHAT_WS: 'wss://ws.beechat.hive-engine.com'
    }
  }]
}
