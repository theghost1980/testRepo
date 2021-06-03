import Vue from 'vue'
import VueLazyload from 'vue-lazyload'

Vue.use(VueLazyload, {
  lazyComponent: true,
  error: 'https://cdn.lensy.io/lensy-placeholder.png',
  loading: 'https://cdn.lensy.io/lensy-animated-loading.gif'
})
