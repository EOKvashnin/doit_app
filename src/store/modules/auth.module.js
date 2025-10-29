import axios from 'axios'
import error from '@/utils/error'
import { firebaseConfig } from '@/firebase'
import { showToast } from '@/utils/toast'

const TOKEN_KEY = 'jwt-token'

export default {
  namespaced: true,
  state() {
    return {
      token: localStorage.getItem(TOKEN_KEY),
    }
  },

  mutations: {
    setToken(state, token) {
      state.token = token
      localStorage.setItem(TOKEN_KEY, token)
    },

    logout(state) {
      state.token = null
      localStorage.removeItem(TOKEN_KEY)
    },
  },

  actions: {
    async login({ commit }, payload) {
      try {
        if (!firebaseConfig.apiKey) {
          showToast.error('Firebase API key is not configured')
          throw new Error('Firebase API key is not configured')
        }

        const url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${firebaseConfig.apiKey}`

        console.log('URL', url)

        const { data } = await axios.post(url, {
          ...payload,
          returnSecureToken: true,
        })

        commit('setToken', data.idToken)

        return data // Добавил возврат данных для возможного использования
      } catch (e) {
        const errorCode = e.response?.data?.error?.message
        const errorMessage = error(errorCode) || 'Произошла неизвестная ошибка'

        showToast.error(errorMessage)

        throw new Error(errorMessage) // Передаем сообщение об ошибке
      }
    },
  },

  getters: {
    token(state) {
      return state.token
    },
    isAuthenticated(_, getters) {
      return !!getters.token
    },
  },
}
