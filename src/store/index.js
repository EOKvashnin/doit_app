import { createLogger, createStore } from 'vuex'
import auth from './modules/auth'
import profile from './modules/profile'
import tasks from './modules/tasks'
import users from './modules/users'

const plugins = []

if (import.meta.env.DEV) {
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
    tasks,
    profile,
    users,
  },
})
