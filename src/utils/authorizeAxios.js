import axios from 'axios'
import { toast } from 'react-toastify'
import { interceptorLoadingElements } from './formatters'
import { handleLogoutAPI, refreshTokenAPI } from '~/apis'

let axiosReduxStore
export const injectStore = mainStore => { axiosReduxStore = mainStore }

let authorizeAxiosInstance = axios.create()
authorizeAxiosInstance.defaults.timeout = 1000 * 60 * 10

authorizeAxiosInstance.interceptors.request.use((config) => {
  interceptorLoadingElements(true)

  const accessToken = localStorage.getItem('accessToken')
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }

  return config
}, (error) => {
  return Promise.reject(error)
})

let refreshTokenPromise = null

authorizeAxiosInstance.interceptors.response.use( (response) => {
  interceptorLoadingElements(false)
  return response
}, (error) => {
  interceptorLoadingElements(false)

  if (error.response?.status === 401) {
    handleLogoutAPI().then(() => {
      location.href = '/login'
    })
  }

  const originalRequests = error.config

  if (error.response?.status === 410 && !originalRequests._retry) {
    originalRequests._retry = true
    if (!refreshTokenPromise) {
      const refreshToken = localStorage.getItem('refreshToken')
      refreshTokenPromise = refreshTokenAPI(refreshToken)
        .then(res => {
          const { accessToken } = res
          localStorage.setItem('accessToken', accessToken)
          authorizeAxiosInstance.defaults.headers.Authorization = `Bearer ${accessToken}`
        })
        .catch((_error) => {
          handleLogoutAPI().then(() => {
            location.href = '/login'
          })
          return Promise.reject(_error)
        })
        .finally(() => {
          refreshTokenPromise = null
        })
    }

    return refreshTokenPromise.then(() => {
      return authorizeAxiosInstance(originalRequests)
    })

  }

  let errorMessage = error?.message
  if (error?.response?.data?.message) {
    errorMessage = error?.response?.data?.message
  }
  if (error.response?.status !== 410) {
    toast.error(errorMessage)
  }
  return Promise.reject(error)
})

export default authorizeAxiosInstance
