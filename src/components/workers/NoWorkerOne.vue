<template>
  <div v-if="isLoading" class="loading-message">Данные загружаются...</div>
  <app-page v-else title="Информация о кандидате">
    <div class="max-w-2xl mx-auto">
      <div
        class="p-6 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700"
      >
        <div class="mb-4">
          <button
            @click="closeForm"
            class="flex items-center text-gray-600 hover:text-gray-900 mb-2"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Назад к списку
          </button>
          <p class="text-gray-900 dark:text-white">
            {{ worker.cur_status }}
          </p>

          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">{{ worker.data.fio }}</h1>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="space-y-3">
            <div>
              <label class="text-sm font-medium text-gray-500">Должность</label>
              <p class="text-gray-900 dark:text-white">
                {{ worker.data.position || 'Не указана' }}
              </p>
            </div>

            <div>
              <label class="text-sm font-medium text-gray-500">Статус</label>
              <p class="text-gray-900 dark:text-white">
                <app-status :type="worker.data.cur_status"></app-status>
              </p>
            </div>

            <div>
              <label class="text-sm font-medium text-gray-500">Руководитель</label>
              <p class="text-gray-900 dark:text-white">{{ worker.data.fioRuc || 'Не указан' }}</p>
            </div>
          </div>

          <div>
            <label class="text-sm font-medium text-gray-500">Примечания</label>
            <p class="text-gray-700 dark:text-gray-300 mt-1">
              {{ worker.data.note || 'Нет примечаний' }}
            </p>
          </div>
        </div>

        <!-- Дополнительные действия -->
        <div class="mt-6 pt-4 border-t border-gray-200">
          <button
            @click="editWorker"
            class="px-4 py-2 bg-pink-500 text-white rounded hover:bg-pink-600 transition-colors"
          >
            Редактировать
          </button>
        </div>
      </div>
    </div>
  </app-page>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { showToast } from '@/utils/toast'

import AppPage from '../ui/AppPage.vue'
import AppStatus from '../ui/AppStatus.vue'

export default {
  components: { AppPage, AppStatus },

  setup() {
    const isLoading = ref(true)
    const store = useStore()
    const router = useRouter()
    const route = useRoute()
    const worker = ref({})

    const workerId = route.params.id

    const closeForm = () => router.push('/')

    onMounted(async () => {
      try {
        worker.value = await store.dispatch('workers/loadOne', workerId)
      } catch (error) {
        showToast.error(error.message || 'Ошибка загрузки данных кандидата')
      } finally {
        isLoading.value = false
      }
    })

    const editWorker = () => {
      // логика редактирования
      console.log('Редактирование worker:', worker.value)
    }

    return { isLoading, worker, closeForm, editWorker }
  },
}
</script>

<style scoped></style>
