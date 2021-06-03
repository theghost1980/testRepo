import axios from 'axios'

export default ({ store, $config }, inject) => {
  const API = {}

  const instance = axios.create({
    baseURL: $config.CHAT_API,
    withCredentials: true
  })

  instance.interceptors.request.use((config) => {
    if (process.client) {
      if (store.state.message.token) {
        config.headers.Authorization = `Bearer ${store.state.message.token}`
      }

      const refreshToken = localStorage.getItem(`beechat-${store.state.user.username}-refresh_token`)

      if (config.url === '/users/refresh-token' && refreshToken) {
        config.headers.Authorization = `Bearer ${refreshToken}`
      }
    }

    return config
  })

  instance.interceptors.response.use((response) => {
    // Return a successful response back to the calling service
    return response
  }, async (error) => {
    if (error.response.status !== 401) {
      return Promise.reject(error)
    }

    let successful = false

    if (error.config.url !== '/users/refresh-token') {
      try {
        console.log('Refreshing token...')

        await store.dispatch('message/refreshToken', { root: true })

        error.config.headers.Authorization = store.state.message.token
        successful = true
      } catch {
        successful = false
        Promise.reject(error)
      }
    }

    if (successful) {
      try {
        // New request with new token
        const config = error.config

        return new Promise((resolve, reject) => {
          axios.request(config).then((response) => {
            resolve(response)
          }).catch((error) => {
            reject(error)
          })
        })
      } catch (error) {
        Promise.reject(error)
      }
    }
  })

  API.call = async (endpoint, params) => {
    const { data } = await instance.get(`/${endpoint}`, { params })

    return data
  }

  API.post = async (endpoint, payload) => {
    const { data } = await instance.post(`/${endpoint}`, payload)

    return data
  }

  inject('chatAPI', API)
}
