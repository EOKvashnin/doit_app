<template>
  <app-loader v-if="loading"></app-loader>
  <app-page title="Список задач" v-else>
    <template #header>
      <!-- Добавляем кнопку управления фильтрами -->
      <button
        @click="toggleFilters"
        class="flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-indigo-500 transition-colors duration-200"
        :class="{ ' text-indigo-500 font-bold': showFilters }"
      >
        <Icon
          icon="lucide:settings-2"
          class="w-5 h-5 transition-all duration-150"
          :class="{ 'w-6 h-6 text-indigo-500': showFilters }"
        />
        Фильтр
      </button>
    </template>
    <transition name="slide-top">
      <TaskFilter v-if="showFilters" v-model="filter" />
    </transition>
    <TasksTable
      :tasks="tasks"
      :showFilters="showFilters"
      @openModal="handleOpenModal"
      @open-card="handleOpenCard"
    />

    <teleport to="body">
      <app-modal v-if="isModalOpen" title="Создать задачу" @close="close">
        <AddTaskModal @created="isModalOpen = false" :initial-status="modalDefaultStatus" />
      </app-modal>
      <app-modal
        v-if="isCardModalOpen"
        :title="titleSelectedTask"
        :priority="prioritySelectedTask"
        @close="close"
      >
        <TaskOneModal @close="isCardModalOpen = false" :task="selectedTask" />
      </app-modal>
    </teleport>
  </app-page>
</template>

<script setup>
import AddTaskModal from '@/components/tasks/AddTaskModal.vue'
import TaskFilter from '@/components/tasks/TaskFilter.vue'
import TaskOneModal from '@/components/tasks/TaskOneModal.vue'
import TasksTable from '@/components/tasks/TasksTable.vue'
import AppLoader from '@/components/ui/AppLoader.vue'
import AppModal from '@/components/ui/AppModal.vue'
import AppPage from '@/components/ui/AppPage.vue'
import { Icon } from '@iconify/vue'
import { computed, onMounted, ref } from 'vue'
import { useStore } from 'vuex'

const store = useStore()
const loading = ref(false)
const filter = ref({})

const isModalOpen = ref(false)
const modalDefaultStatus = ref('todo')
const isCardModalOpen = ref(false)
const selectedTask = ref(null)
const prioritySelectedTask = ref(null)
const titleSelectedTask = ref('')

const tasks = computed(() => {
  const f = filter.value
  let res = store.getters['tasks/tasks']
  if (f.title) res = res.filter((t) => t.title?.toLowerCase().includes(f.title.toLowerCase()))
  if (f.authorFio)
    res = res.filter((t) => t.authorFio?.toLowerCase().includes(f.authorFio.toLowerCase()))
  if (f.assigneeFio)
    res = res.filter((t) => t.assigneeFio?.toLowerCase().includes(f.assigneeFio.toLowerCase()))
  if (f.priority) res = res.filter((t) => t.priority === f.priority)
  return res
})

const handleOpenModal = (status) => {
  modalDefaultStatus.value = status || 'todo'
  isModalOpen.value = true
}

const handleOpenCard = (task) => {
  selectedTask.value = task
  titleSelectedTask.value = task.title
  prioritySelectedTask.value = task?.priority || 'new'
  isCardModalOpen.value = true
}

const close = () => {
  isModalOpen.value = false
  isCardModalOpen.value = false
}

const showFilters = ref(false)

const toggleFilters = () => {
  showFilters.value = !showFilters.value
}

onMounted(async () => {
  loading.value = true
  await store.dispatch('tasks/load')
  loading.value = false
})
</script>

<style scoped>
/* Активные состояния определяют продолжительность и easing */
.slide-top-enter-active,
.slide-top-leave-active {
  transition: all 0.4s ease;
  /* position: relative; - не обязательно, если контекст позволяет */
}

/* Начальное состояние входа (перед появлением) */
.slide-top-enter-from {
  opacity: 0;
  transform: translateY(-100%);
}

/* Конечное состояние входа (после появления) */
.slide-top-enter-to {
  opacity: 1;
  transform: translateY(0);
}

/* Начальное состояние выхода (перед исчезновением) */
.slide-top-leave-from {
  opacity: 1;
  transform: translateY(0);
}

/* Конечное состояние выхода (после исчезновения) */
.slide-top-leave-to {
  opacity: 0;
  transform: translateY(-100%);
}
</style>
