<template>
  <app-loader v-if="loading"></app-loader>
  <app-page title="Мои задачи" v-else>
    <template #header> </template>

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
        <TaskOneModal
          @close="isCardModalOpen = false"
          :task="selectedTask"
          @update="handleTaskUpdate"
        />
      </app-modal>
    </teleport>
  </app-page>
</template>

<script setup>
import AddTaskModal from '@/components/tasks/AddTaskModal.vue'
import TaskOneModal from '@/components/tasks/TaskOneModal.vue'
import TasksTable from '@/components/tasks/TasksTable.vue'
import AppLoader from '@/components/ui/AppLoader.vue'
import AppModal from '@/components/ui/AppModal.vue'
import AppPage from '@/components/ui/AppPage.vue'
import { computed, onMounted, ref } from 'vue'
import { useStore } from 'vuex'

const store = useStore()
const loading = ref(false)

const isModalOpen = ref(false)
const modalDefaultStatus = ref('todo')
const isCardModalOpen = ref(false)
const selectedTask = ref(null)
const prioritySelectedTask = ref(null)
const titleSelectedTask = ref('')

// ✅ Мемоизированная фильтрация задач текущего пользователя
const tasks = computed(() => {
  const allTasks = store.getters['tasks/tasks']
  const currentUserEmail = store.getters['auth/userEmail']

  // Если нет email или задач — возвращаем пустой массив
  if (!currentUserEmail || !allTasks?.length) {
    return []
  }

  // ✅ Кэшируем проверку типа executors для производительности
  return allTasks.filter((task) => {
    if (!task.executors) return false

    // Оптимизированная проверка исполнителя
    if (Array.isArray(task.executors)) {
      return task.executors.includes(currentUserEmail)
    }

    if (typeof task.executors === 'string') {
      // Избегаем split для каждой задачи — используем includes с запятыми
      const executorsList = task.executors.split(',')
      return executorsList.some((executor) => executor.trim() === currentUserEmail)
    }

    return false
  })
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

const handleTaskUpdate = (updatedTask) => {
  // ✅ Обновляем локальные refs для модалки
  selectedTask.value = updatedTask
  titleSelectedTask.value = updatedTask.title
  prioritySelectedTask.value = updatedTask.priority

  // ✅ Коммитим в store для реактивности computed-свойств
  store.commit('tasks/updateTask', updatedTask)
}

const close = () => {
  isModalOpen.value = false
  isCardModalOpen.value = false
}

const showFilters = ref(false)

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
