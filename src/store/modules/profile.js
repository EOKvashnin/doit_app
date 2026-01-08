import taskAxios from '@/axios/tasks'
import { showToast } from '@/utils/toast'

export default {
  namespaced: true,
  state() {
    return {
      profile: null,
    }
  },
  mutations: {
    setProfile(state, profile) {
      state.profile = profile
    },
  },
  actions: {
    async load({ commit, rootGetters }) {
      const user = rootGetters['auth/user']
      if (!user?.id) return

      const token = rootGetters['auth/token']
      if (!token) return

      const isAuthPage = () => {
        return window.location.pathname === '/main' || window.location.pathname.includes('/main/')
      }

      try {
        const res = await taskAxios.get(`/users/${user.id}.json?auth=${token}`)
        const profile = res.data || { displayName: '', avatarUrl: '' }
        commit('setProfile', { ...profile, id: user.id })
      } catch (e) {
        if (!isAuthPage) {
          console.error('Ошибка загрузки профиля:', e)
          showToast.error('Не удалось загрузить профиль')
        }
      }
    },

    async save({ rootGetters }, { displayName, avatarUrl }) {
      const user = rootGetters['auth/user']
      const token = rootGetters['auth/token']

      if (!user?.id || !token) {
        showToast.error('Вы не авторизованы')
        return
      }

      const profileData = {
        displayName: displayName.trim() || '',
        avatarUrl: avatarUrl || '',
        email: rootGetters['auth/userEmail'] || '',
      }

      try {
        await taskAxios.put(`/users/${user.id}.json?auth=${token}`, profileData)
        showToast.success('Профиль обновлён')
      } catch (e) {
        console.error('Ошибка сохранения:', e)
        showToast.error('Не удалось сохранить профиль')
      }
    },
  },
  getters: {
    profile: (state) => state.profile,
    displayName: (state) => state.profile?.displayName || null,
    avatarUrl: (state) => state.profile?.avatarUrl || null,
  },
}
