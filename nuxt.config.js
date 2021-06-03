export default {
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'NFTTunz',
    meta: [
      { charset: 'utf-8' },
      { hid: 'description', name: 'description', content: 'Collectible, Scarce, Tokenized Music' },
      { hid: 'og-type', property: 'og:type', content: 'website' },
      { hid: 'og-title', property: 'og:title', content: 'NFTTunz' },
      { hid: 'og-image', property: 'og:image', content: 'https://cdn.lensy.io/website/lensy.png' },
      { hid: 'og-description', property: 'og:description', content: 'Collectible, Scarce, Tokenized Music' },
      { hid: 'twitter-card', name: 'twitter:card', content: 'summary_large_image' },
      { hid: 'twitter-title', name: 'twitter:title', content: 'NFTTunz' },
      { hid: 'twitter-description', name: 'twitter:description', content: 'Collectible, Scarce, Tokenized Music' },
      { hid: 'twitter-image', name: 'twitter:image', content: 'https://cdn.lensy.io/website/lensy.png' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Roboto:wght@400;500&display=swap' }
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    'emoji-mart-vue-fast/css/emoji-mart.css',
    '@/assets/scss/app.scss'
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    '@/plugins/api.js',
    '@/plugins/chat-api.js',
    '@/plugins/event-bus.client.js',
    '@/plugins/global-mixins.js',
    '@/plugins/hive.js',
    '@/plugins/referral-tracker.js',
    '@/plugins/sidechain.js',
    '@/plugins/vue-chat-scroll.client.js',
    '@/plugins/vue-icon.js',
    '@/plugins/vue-lazy.js',
    '@/plugins/vue-plyr.client.js',
    '@/plugins/vue-timeago.js',
    '@/plugins/vue-timers.client.js',
    '@/plugins/vuelidate.js',
    '@/plugins/websocket.client.js'
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: false,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    ['@nuxtjs/eslint-module', { fix: true }]
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/bootstrap
    'bootstrap-vue/nuxt',
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    // https://go.nuxtjs.dev/pwa
    '@nuxtjs/pwa',
    'cookie-universal-nuxt'
  ],

  bootstrapVue: {
    componentPlugins: [
      'AlertPlugin',
      'LayoutPlugin',
      'NavbarPlugin',
      'FormPlugin',
      'FormCheckboxPlugin',
      'FormGroupPlugin',
      'FormSelectPlugin',
      'FormInputPlugin',
      'FormTextareaPlugin',
      'FormFilePlugin',
      'FormRadioPlugin',
      'ToastPlugin',
      'ModalPlugin',
      'ButtonPlugin',
      'SpinnerPlugin',
      'CardPlugin',
      'ImagePlugin',
      'TablePlugin',
      'PaginationPlugin',
      'TabsPlugin',
      'PopoverPlugin',
      'InputGroupPlugin',
      'AvatarPlugin',
      'FormTagsPlugin',
      'BadgePlugin',
      'MediaPlugin',
      'EmbedPlugin',
      'ProgressPlugin',
      'VBTooltipPlugin'
    ]
  },

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {},

  // PWA module configuration: https://go.nuxtjs.dev/pwa
  pwa: {
    meta: {
      name: 'NFTTunz',
      author: 'NFTTunz'
    },

    manifest: {
      lang: 'en',
      name: 'NFTTunz',
      short_name: 'NFTTunz',
      theme_color: '#ffffff'
    },

    workbox: {
      runtimeCaching: [
        {
          urlPattern: 'https://fonts.googleapis.com/.*',
          handler: 'cacheFirst',
          method: 'GET',
          strategyOptions: { cacheableResponse: { statuses: [0, 200] } }
        },
        {
          urlPattern: 'https://fonts.gstatic.com/.*',
          handler: 'cacheFirst',
          method: 'GET',
          strategyOptions: { cacheableResponse: { statuses: [0, 200] } }
        }
      ]
    }
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    transpile: [
      'vue-icon',
      'vue-pincode-input',
      'vue-chat-scroll',
      'clickout-event',
      'emoji-mart-vue-fast/src/components/Emoji',
      'emoji-mart-vue-fast/src/components/Picker',
      'emoji-mart-vue-fast/src/utils/emoji-data',
      'emoji-mart-vue-fast/src/utils/shared-props',
      'emoji-mart-vue-fast/data/twitter.json'
    ],
    babel: {
      compact: true
    }
  },

  server: {
    port: 3000, // default: 3000
    host: 'localhost'
  },

  publicRuntimeConfig: {
    EXPLORER_URL: 'https://he.dtools.dev',
    API_BASE_URL: process.env.API_BASE_URL || 'https://nfttunz.io/api', // http://localhost:3000
    CHAT_API: process.env.CHAT_API || 'http://localhost:5001',
    CHAT_WS: process.env.CHAT_WS || 'ws://localhost:5000',
    CHANNELS: process.env.CHANNELS || ['01EPB6A2PPSW0BQVJ7WDDP568C']
  },
  // ssr: false,
  target: 'static', // default is 'server'
}
