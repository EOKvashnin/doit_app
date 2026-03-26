import taskAxios from '@/axios/tasks'
import { showToast } from '@/utils/toast'

export default {
  namespaced: true,
  state: {
    allUsers: [],
    emailToUser: {},
  },
  mutations: {
    setAllUsers(state, users) {
      state.allUsers = users
      const map = {}
      users.forEach((user) => {
        if (user.email) {
          map[user.email] = user
        }
      })
      state.emailToUser = map
    },

    // 🆕 Мутация для обновления одного пользователя
    updateUser(state, updatedUser) {
      // Обновляем в allUsers
      const index = state.allUsers.findIndex((u) => u.id === updatedUser.id)
      if (index !== -1) {
        state.allUsers.splice(index, 1, updatedUser)
      }

      // Обновляем в emailToUser
      if (updatedUser.email) {
        state.emailToUser[updatedUser.email] = updatedUser
      }
    },
  },
  actions: {
    async loadAll({ commit, rootGetters }) {
      try {
        const token = rootGetters['auth/token']
        const res = await taskAxios.get(`/users.json?auth=${token}`)
        const data = res.data || {}
        const users = Object.keys(data).map((id) => ({
          id,
          ...data[id],
        }))
        commit('setAllUsers', users)
      } catch (e) {
        const isAuthPage = () => {
          return window.location.pathname === '/main' || window.location.pathname.includes('/main/')
        }
        if (!isAuthPage) {
          if (e.response?.status === 401) {
            showToast.error('Ошибка авторизации')
          } else {
            showToast.error(e.message || 'Не удалось загрузить аватары пользователей')
          }
          console.error('Не удалось загрузить аватары пользователей', e)
        }
      }
    },

    // 🆕 Действие для сохранения одного пользователя
    async saveUser({ commit, rootGetters }, { id, data }) {
      const token = rootGetters['auth/token']
      if (!token) {
        showToast.error('Вы не авторизованы')
        return
      }

      try {
        // ✅ Отправляем весь объект через PUT
        await taskAxios.put(`/users/${id}.json?auth=${token}`, data)
        showToast.success('Профиль обновлён')
        commit('updateUser', { id, ...data })
      } catch (e) {
        showToast.error('Не удалось сохранить профиль')
      }
    },
  },
  getters: {
    getUserByEmail: (state) => (email) => {
      return state.emailToUser[email] || null
    },
    getAvatarByEmail: (state) => (email) => {
      // ✅ Vuex getters автоматически кэшируются на основе реактивных зависимостей
      // Пересчитываются только при изменении state.emailToUser
      return state.emailToUser[email]?.avatarUrl || null
    },
    getDisplayNameByEmail: (state) => (email) => {
      // ✅ Возвращаем displayName или email по умолчанию
      return state.emailToUser[email]?.displayName || email
    },
    // ✅ Добавляем селектор для получения всех пользователей — полезно для списков
    allUsersList: (state) => state.allUsers,
    // ✅ Селектор для быстрого получения пользователя по ID
    getUserById: (state) => (id) => {
      return state.allUsers.find((u) => u.id === id) || null
    },
  },
}
