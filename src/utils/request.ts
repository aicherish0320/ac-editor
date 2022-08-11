import axios from 'axios'

const BASE_URL = '/api'

const request = axios.create({
  baseURL: BASE_URL,
  timeout: 10000
})

request.interceptors.request.use(
  (config) => {
    return config
  },
  (error) => {
    Promise.reject(error)
  }
)

request.interceptors.response.use(
  (response) => {
    const { data: responseData, config } = response

    if (responseData.errno === 0) {
      // 登陆
      if (config.url === '/users/loginByPhoneNumber') {
        const token = responseData.data.token
        request.defaults.headers.common.Authorization = `Bearer ${token}`
      }

      return responseData.data
    } else {
      return Promise.reject(responseData.msg || 'error')
    }
  },
  (error) => {
    return Promise.reject(error)
  }
)

export default request
