<template>
  <app-loader v-if="loading"></app-loader>
  <app-page title="Список кандидатов" v-else>
    <template #header>
      <button @click="isModalOpen = true">
        <svg
          class="w-[38px] h-[38px] text-gray-800 dark:text-white hover:text-pink-500 transition-colors duration-200"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            fill-rule="evenodd"
            d="M9 4a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm-2 9a4 4 0 0 0-4 4v1a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-1a4 4 0 0 0-4-4H7Zm8-1a1 1 0 0 1 1-1h1v-1a1 1 0 1 1 2 0v1h1a1 1 0 1 1 0 2h-1v1a1 1 0 1 1-2 0v-1h-1a1 1 0 0 1-1-1Z"
            clip-rule="evenodd"
          />
        </svg>
      </button>
    </template>
    <workers-filter v-model="filter"></workers-filter>

    <workers-table
      :workers="workers"
      @open-card="handleOpenCard"
      @workerUpdated="handleWorkerUpdate"
    ></workers-table>

    <teleport to="body">
      <app-modal v-if="isModalOpen" title="Добавить соискателя" @close="isModalOpen = false">
        <workers-modal @created="isModalOpen = false"></workers-modal>
      </app-modal>

      <app-modal
        v-if="isCardModalOpen"
        title="Информация о кандидате"
        @close="isCardModalOpen = false"
      >
        <worker-one-modal
          @close="isCardModalOpen = false"
          :worker="selectedWorker"
        ></worker-one-modal>
      </app-modal>
    </teleport>
  </app-page>
</template>

<script>
import AppLoader from '@/components/ui/AppLoader.vue'
import AppModal from '@/components/ui/AppModal.vue'
import AppPage from '@/components/ui/AppPage.vue'
import WorkerOneModal from '@/components/workers/WorkerOneModal.vue'
import WorkersFilter from '@/components/workers/WorkersFilter.vue'
import WorkersModal from '@/components/workers/WorkersModal.vue'
import WorkersTable from '@/components/workers/WorkersTable.vue'

import { ref, computed, onMounted, watch } from 'vue'
import { useStore } from 'vuex'

export default {
  name: 'HomePage',
  components: {
    AppPage,
    AppLoader,
    AppModal,
    WorkersTable,
    WorkersModal,
    WorkersFilter,
    WorkerOneModal,
  },

  setup() {
    const store = useStore()
    const isModalOpen = ref(false)
    const isCardModalOpen = ref(false)
    const selectedWorker = ref(null)
    const loading = ref(false)

    const filter = ref({
      fio: '',
      position: '',
      boss: '',
      status: '',
    })

    watch(
      filter,
      (newValue) => {
        console.log('Filter changed:', newValue)
      },
      { deep: true },
    )

    onMounted(async () => {
      loading.value = true
      try {
        await store.dispatch('workers/load')
      } catch (e) {
        console.error('Ошибка загрузки:', e)
      } finally {
        loading.value = false
      }
    })

    const workers = computed(() => {
      try {
        const allWorkers = store.state.workers.workers || []

        return allWorkers.filter((worker) => {
          // Безопасный доступ к свойствам worker с учетом реальной структуры данных
          const workerFio = worker.fio || ''
          const workerPosition = worker.position || ''
          const workerBoss = worker.fioRuc || ''
          const workerStatus = worker.cur_status || '' // Исправлено: cur_status вместо status

          // Фильтр по ФИО кандидата
          const fioMatch = filter.value.fio
            ? workerFio.toLowerCase().includes(filter.value.fio.toLowerCase())
            : true

          // Фильтр по должности
          const positionMatch = filter.value.position
            ? workerPosition.toLowerCase().includes(filter.value.position.toLowerCase())
            : true

          // Фильтр по руководителю
          const bossMatch = filter.value.boss
            ? workerBoss.toLowerCase().includes(filter.value.boss.toLowerCase())
            : true

          // Фильтр по статусу - используем cur_status
          const statusMatch = filter.value.status ? filter.value.status === workerStatus : true

          return fioMatch && positionMatch && bossMatch && statusMatch
        })
      } catch (error) {
        console.error('Error in workers computed:', error)
        return []
      }
    })

    const handleOpenCard = (worker) => {
      selectedWorker.value = worker
      isCardModalOpen.value = true
    }

    const handleWorkerUpdate = (updatedWorker) => {
      // Обновляем локальное состояние
      selectedWorker.value = updatedWorker
    }

    const handleModalClose = () => {
      isModalOpen.value = false
      selectedWorker.value = null
    }

    return {
      isModalOpen,
      isCardModalOpen,
      selectedWorker,
      handleOpenCard,
      handleWorkerUpdate,
      handleModalClose,
      loading,
      workers,
      filter,
    }
  },
}
</script>
