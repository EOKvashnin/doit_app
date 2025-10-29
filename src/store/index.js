import { createStore, createLogger } from 'vuex'
import auth from './modules/auth.module'
import workers from './modules/workers.module'

const plugins = []

if (process.env.NODE_ENV === 'development') {
  plugins.push(createLogger())
}

export default createStore({
  plugins,
  state() {
    return {
      sidebar: false,
    }
  },
  getters: {},
  mutations: {
    openSidebar(state) {
      state.sidebar = true
    },
    closeSidebar(state) {
      state.sidebar = false
    },
  },

  modules: {
    auth,
    workers,
  },
})
