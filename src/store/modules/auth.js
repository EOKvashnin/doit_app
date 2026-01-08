import { firebaseConfig } from '@/firebase'
import error from '@/utils/error'
import { showToast } from '@/utils/toast'
import axios from 'axios'

const TOKEN_KEY = 'jwt-token'
const USER_KEY = 'user-info'

const isAuthPage = () => {
  return window.location.pathname === '/main' || window.location.pathname.includes('/main/')
}

export default {
  namespaced: true,
  state() {
    return {
      token: localStorage.getItem(TOKEN_KEY),
      user: JSON.parse(localStorage.getItem(USER_KEY)),
    }
  },

  mutations: {
    setToken(state, token) {
      state.token = token
      localStorage.setItem(TOKEN_KEY, token)
    },
    setUser(state, user) {
      state.user = user
      localStorage.setItem(USER_KEY, JSON.stringify(user))
    },

    logout(state) {
      state.token = null
      localStorage.removeItem(TOKEN_KEY)
      localStorage.removeItem(USER_KEY)
    },
  },

  actions: {
    async login({ commit }, payload) {
      try {
        if (!firebaseConfig.apiKey) {
          showToast.error('Firebase API key is not configured')
          throw new Error('Firebase API key is not configured')
        }
        console.log(isAuthPage())

        const url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${firebaseConfig.apiKey}`

        const { data } = await axios.post(url, {
          ...payload,
          returnSecureToken: true,
        })

        commit('setToken', data.idToken)
        commit('setUser', {
          email: data.email,
          id: data.localId,
        })

        return data
      } catch (e) {
        const errorCode = e.response?.data?.error?.message
        const errorMessage = error(errorCode) || 'Произошла неизвестная ошибка'
        console.log(errorMessage)
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
    user: (state) => state.user,
    userEmail: (state) => state.user?.email || null,
  },
}
