import taskAxios from '@/axios/tasks'
import { showToast } from '@/utils/toast'

const isAuthPage = () => {
  return window.location.pathname === '/auth' || window.location.pathname.includes('/auth/')
}

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
    updateTask(state, updatedTask) {
      const index = state.tasks.findIndex((w) => w.id === updatedTask.id)
      if (index !== -1) {
        state.tasks[index] = updatedTask
      }
    },
    addCommentToTask(state, { taskId, comment }) {
      const task = state.tasks.find((t) => t.id === taskId)
      if (task) {
        if (!task.comments) task.comments = []
        task.comments.unshift(comment)
      }
    },
    addTasks(state, tasks) {
      state.tasks.push(tasks)
    },
    removeTask(state, id) {
      state.tasks = state.tasks.filter((task) => task.id !== id)
    },
    removeCommentFromTask(state, { taskId, commentId }) {
      const task = state.tasks.find((t) => t.id === taskId)
      if (task && Array.isArray(task.comments)) {
        task.comments = task.comments.filter((c) => c.id !== commentId)
      }
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
          console.log('Ошибка авторизации')
        } else {
          showToast.warning('Что-то пошло не так')
          console.log('Что-то пошло не так')
        }
        console.error(e)
      }
    },
    async update({ rootGetters }, payload) {
      try {
        // Получаем токен из auth модуля
        const token = rootGetters['auth/token']
        if (!token) {
          showToast.error('Токен авторизации не найден')
          throw new Error('Токен авторизации не найден')
        }
        const isAuthPage = () => {
          return window.location.pathname === '/main' || window.location.pathname.includes('/main/')
        }

        // Используем данные из payload
        const { id, data } = payload

        await taskAxios.put(`/tasks/${id}.json?auth=${token}`, data)
      } catch (e) {
        if (!isAuthPage) {
          if (e.response && e.response.status === 401) {
            showToast.error('Ошибка авторизации')
          } else {
            showToast.error(e.message || 'Что-то пошло не так')
          }
          console.error(e)
        }
      }
    },
    async addComment({ commit, rootGetters }, { taskId, comment }) {
      try {
        const token = rootGetters['auth/token']
        if (!token) {
          showToast.error('Токен авторизации не найден')
          throw new Error('Токен авторизации не найден')
        }

        // 1. Сначала отправляем комментарий на сервер

        const taskResponse = await taskAxios.get(`/tasks/${taskId}.json?auth=${token}`)
        const currentTask = taskResponse.data

        if (!currentTask) {
          throw new Error('Задача не найдена')
        }

        // Добавляем новый комментарий
        const updatedComments = currentTask.comments
          ? [comment, ...currentTask.comments]
          : [comment]
        const updatedTask = {
          ...currentTask,
          comments: updatedComments,
          editedAt: new Date().toISOString(), // обновляем editedAt
        }

        // Сохраняем ВСЮ задачу (Firebase не поддерживает частичное обновление вложенных полей)
        await taskAxios.put(`/tasks/${taskId}.json?auth=${token}`, updatedTask)

        // 2. Обновляем локальное состояние

        commit('updateTask', { ...updatedTask, id: taskId }) // или просто updateTask
      } catch (e) {
        const isAuthPage = () => {
          return window.location.pathname === '/main' || window.location.pathname.includes('/main/')
        }
        if (!isAuthPage) {
          if (e.response?.status === 401) {
            showToast.error('Ошибка авторизации')
          } else {
            showToast.error(e.message || 'Не удалось добавить комментарий')
          }
          console.error('Ошибка при добавлении комментария:', e)
        }
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
        const isAuthPage = () => {
          return window.location.pathname === '/main' || window.location.pathname.includes('/main/')
        }
        if (!isAuthPage) {
          if (e.response && e.response.status === 401) {
            showToast.warning('Ошибка авторизации')
            console.log('Ошибка авторизации')
          } else {
            showToast.warning('Что-то пошло не так')
            console.log('Что-то пошло не так')
          }
          console.error(e)
        }
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
    async removeComment({ commit, rootGetters }, { taskId, commentId }) {
      try {
        const token = rootGetters['auth/token']
        if (!token) {
          showToast.error('Токен авторизации не найден')
          throw new Error('Токен авторизации не найден')
        }

        // 1. Получаем текущую задачу
        const taskResponse = await taskAxios.get(`/tasks/${taskId}.json?auth=${token}`)
        const currentTask = taskResponse.data

        if (!currentTask) {
          throw new Error('Задача не найдена')
        }

        // 2. Удаляем комментарий из массива
        const updatedComments = (currentTask.comments || []).filter((c) => c.id !== commentId)

        const updatedTask = {
          ...currentTask,
          comments: updatedComments,
          editedAt: new Date().toISOString(),
        }

        // 3. Сохраняем всю задачу (Firebase требует полной перезаписи)
        await taskAxios.put(`/tasks/${taskId}.json?auth=${token}`, updatedTask)

        // 4. Обновляем локальное состояние
        commit('removeCommentFromTask', { taskId, commentId })
        commit('updateTask', { ...updatedTask, id: taskId })
      } catch (e) {
        if (e.response?.status === 401) {
          showToast.error('Ошибка авторизации')
        } else {
          showToast.error(e.message || 'Не удалось удалить комментарий')
        }
        console.error('Ошибка при удалении комментария:', e)
      }
    },
  },

  getters: {
    tasks(state) {
      return state.tasks
    },
  },
}
