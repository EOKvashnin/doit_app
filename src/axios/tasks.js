import { firebaseConfig } from '@/firebase'
import axios from 'axios'
import router from '../router'

const taskAxios = axios.create({
  baseURL: firebaseConfig.databaseURL,
})

// Add a response interceptor
taskAxios.interceptors.response.use(
  null,
  (error) => {
    if (error.response.status === 401) {
      router.push('/auth?message=auth')
    }

    return Promise.reject(error)
  },
  function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error)
  },
)

export default taskAxios
