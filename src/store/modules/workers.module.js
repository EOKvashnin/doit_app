//import store from "../index";
import workerAxios from '../../axios/workers'
import { showToast } from '@/utils/toast'

export default {
  namespaced: true,

  state() {
    return {
      workers: [],
    }
  },

  mutations: {
    setWorkers(state, workers) {
      state.workers = workers
    },

    updateWorker(state, updatedWorker) {
      const index = state.workers.findIndex((w) => w.id === updatedWorker.id)
      if (index !== -1) {
        state.workers[index] = updatedWorker
      }
    },

    addWorker(state, worker) {
      state.workers.push(worker)
    },

    removeWorker(state, id) {
      state.workers = state.workers.filter((worker) => worker.id !== id)
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
        const extendedPayload = {
          ...payload,
          comment: {}, // инициализируем пустым массивом
        }

        const { data } = await workerAxios.post(`/workers.json?auth=${token}`, extendedPayload)
        commit('addWorker', { ...payload, id: data.name })
        showToast.success(
          `
          <div style="display: flex; align-items: center; gap: 8px;">
            <span>🎉</span>
            <span>Работник успешно добавлен</span>
          </div>
        `,
          {
            position: 'bottom-right',
            duration: 5000,
          },
        )
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

    async load({ commit, rootGetters }) {
      try {
        // Получаем токен из auth модуля
        const token = rootGetters['auth/token']
        if (!token) {
          throw new Error('Токен авторизации не найден')
        }

        const { data } = await workerAxios.get(`/workers.json?auth=${token}`)
        const workers = Object.keys(data).map((id) => ({ ...data[id], id }))

        commit('setWorkers', workers)
      } catch (e) {
        if (e.response && e.response.status === 401) {
          showToast.error('Ошибка авторизации')
        } else {
          showToast.warning(e.message || 'Что-то пошло не так')
        }
        console.error(e)
      }
    },

    async loadOne({ dispatch, rootGetters }, id) {
      try {
        // Получаем токен из auth модуля
        const token = rootGetters['auth/token']
        if (!token) {
          showToast.error('Токен авторизации не найден')
          throw new Error('Токен авторизации не найден')
        }

        const { data } = await workerAxios.get(`/workers/${id}.json?auth=${token}`)

        return { data }
      } catch (e) {
        if (e.response && e.response.status === 401) {
          showToast.error('Ошибка авторизации')
        } else {
          showToast.warning('Что-то пошло не так')
        }
        console.error(e)
      }
    },

    async remove({ commit, dispatch, rootGetters }, id) {
      try {
        // Получаем токен из auth модуля
        const token = rootGetters['auth/token']
        if (!token) {
          showToast.error('Токен авторизации не найден')
          throw new Error('Токен авторизации не найден')
        }

        await workerAxios.delete(`/workers/${id}.json?auth=${token}`)

        commit('removeWorker', id) // Исправлено на removeWorker
      } catch (e) {
        showToast.warning(e.message)
      }
    },

    async update({ dispatch, rootGetters }, payload) {
      try {
        // Получаем токен из auth модуля
        const token = rootGetters['auth/token']
        if (!token) {
          showToast.error('Токен авторизации не найден')
          throw new Error('Токен авторизации не найден')
        }

        // Используем данные из payload
        const { id, data } = payload

        await workerAxios.put(`/workers/${id}.json?auth=${token}`, data)
      } catch (e) {
        if (e.response && e.response.status === 401) {
          showToast.error('Ошибка авторизации')
        } else {
          showToast.error(e.message || 'Что-то пошло не так')
        }
        console.error(e)
      }
    },
  },

  getters: {
    workers: (state) => state.workers,
    getWorkerById: (state) => (id) => state.workers.find((worker) => worker.id === id),
  },
}
