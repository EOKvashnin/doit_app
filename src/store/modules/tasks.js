import taskAxios from '@/axios/tasks'
import { showToast } from '@/utils/toast'

export default {
  namespaced: true,
  state() {
    return {
      tasks: [],
    }
  },
  mutations: {
    setTasks(state, tasks) {
      state.tasks = tasks
    },
    addTasks(state, tasks) {
      state.tasks.push(tasks)
    },
    removeTask(state, id) {
      state.tasks = state.tasks.filter((task) => task.id !== id)
    },
  },
  actions: {
    async create({ commit, rootGetters }, payload) {
      try {
        // Получаем токен из auth модуля
        const token = rootGetters['auth/token']
        if (!token) {
          showToast.warning('Токен авторизации не найден')
          throw new Error('Токен авторизации не найден')
        }
        const fullTasks = {
          // Здесь будум обогащать payload неявными полями
          ...payload,
          createdAt: new Date().toISOString(), // ISO-строка: "2025-12-04T10:30:00.000Z"
        }

        const { data } = await taskAxios.post(`/tasks.json?auth=${token}`, fullTasks)
        commit('addTasks', { ...fullTasks, id: data.name })
        showToast.success('Задача успешно добавлена')
      } catch (e) {
        if (e.response && e.response.status === 401) {
          showToast.warning('Ошибка авторизации')
          console.log('Ошибка авторизации')
        } else {
          showToast.warning('Что-то пошло не так')
          console.log('Что-то пошло не так')
        }
        console.error(e)
      }
    },
    async load({ commit, rootGetters }, payload) {
      try {
        // Получаем токен из auth модуля
        const token = rootGetters['auth/token']
        if (!token) {
          showToast.warning('Токен авторизации не найден')
          throw new Error('Токен авторизации не найден')
        }
        const fullTasks = {
          // Здесь будум обогащать payload неявными полями
          ...payload,
          createdAt: new Date().toISOString(), // ISO-строка: "2025-12-04T10:30:00.000Z"
        }

        const { data } = await taskAxios.get(`/tasks.json?auth=${token}`)
        const tasks = Object.keys(data).map((id) => ({ ...data[id], id }))
        commit('setTasks', tasks)
      } catch (e) {
        if (e.response && e.response.status === 401) {
          showToast.warning('Ошибка авторизации')
          console.log('Ошибка авторизации')
        } else {
          showToast.warning('Что-то пошло не так')
          console.log('Что-то пошло не так')
        }
        console.error(e)
      }
    },
    async remove({ commit, rootGetters }, id) {
      try {
        // Получаем токен из auth модуля
        const token = rootGetters['auth/token']
        if (!token) {
          showToast.error('Токен авторизации не найден')
          throw new Error('Токен авторизации не найден')
        }

        await taskAxios.delete(`/tasks/${id}.json?auth=${token}`)

        commit('removeTask', id) //
      } catch (e) {
        showToast.warning(e.message)
      }
    },
  },
  getters: {
    tasks(state) {
      return state.tasks
    },
  },
}
