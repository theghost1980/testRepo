export default ({ app, store, $config, $axios, redirect, route }, inject) => {
  const API = $axios.create({
    baseURL: $config.API_BASE_URL,
    withCredentials: true
  })

  API.interceptors.request.use((config) => {
    if (process.client) {
      if (store.state.user.token) {
        config.headers.Authorization = `Bearer ${store.state.user.token}`
      }
    }

    return config
  })

  API.onError(async (error) => {
    const code = parseInt(error.response && error.response.status)

    if (code === 401) {
      await store.dispatch('user/verifyLogin')

      if (store.state.user.authenticated) {
        error.response.config.headers.Authorization = `Bearer ${store.state.user.token}`

        return $axios(error.response.config)
      } else {
        app.router.app.$root.$bvModal.show('loginModal')
      }
    }

    return Promise.reject(error)
  })

  API.call = (endpoint, params) => {
    return API.$get(endpoint, { params })
  }

  inject('API', API)
}
