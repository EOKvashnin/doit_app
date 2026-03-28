<template>
  <app-loader v-if="loading"></app-loader>
  <app-page title="Отчёт руководителя" v-else>
    <template #header>
      <div class="flex items-center gap-4">
        <div class="flex items-center gap-2">
          <label for="commentDays" class="text-sm font-medium text-gray-400">
            Последний комментарий (дней):
          </label>
          <input
            id="commentDays"
            v-model.number="commentDays"
            type="number"
            min="0"
            class="input-filter w-32"
            placeholder="N"
          />
        </div>
      </div>
    </template>

    <div class="w-[95%] mx-auto mt-4 pb-15 flex-1 overflow-hidden">
      <!-- Горизонтальные блоки по исполнителям -->
      <div class="scrollable-column pr-3 h-full overflow-y-auto">
        <div class="space-y-6 pb-[20px]">
          <div
            v-for="(executorData, executorEmail) in groupedTasks"
            :key="executorEmail"
            class="border-2 border-gray-700 rounded-lg p-4"
          >
            <!-- Заголовок блока с аватаркой исполнителя -->
            <div class="flex items-center gap-3 mb-4">
              <UserAvatar
                :avatar-url="getAvatarByEmail(executorEmail) || '/defaultUser.png'"
                :display-name="getDisplayNameByEmail(executorEmail) || executorEmail"
                :size="40"
                :tooltip="true"
                :editable="false"
              />
              <h2 class="text-lg font-semibold text-gray-200">
                {{ getDisplayNameByEmail(executorEmail) || executorEmail }}
              </h2>
            </div>

            <!-- Внутреннее разделение на две колонки -->
            <div class="relative">
              <div class="grid grid-cols-2 gap-8 items-stretch">
                <!-- Левая колонка: В работе и Тестируется -->
                <div class="flex flex-col">
                  <h3 class="text-sm font-medium text-gray-600 mb-2 flex items-center gap-1">
                    <Icon icon="line-md:cog-filled-loop" class="w-4 h-4" />
                    В работе и тестируется
                    <span class="text-xs text-gray-400"
                      >({{ executorData.inProgress.length }})</span
                    >
                  </h3>
                  <div
                    v-if="executorData.inProgress.length === 0"
                    class="text-center text-gray-400 text-sm py-4 flex-1 flex items-center justify-center"
                  >
                    Задач нет
                  </div>
                  <div
                    v-else
                    class="grid gap-2 flex-1"
                    :class="executorData.inProgress.length === 1 ? 'grid-cols-1' : 'grid-cols-2'"
                    :style="executorData.inProgress.length === 1 ? 'grid-template-rows: 1fr' : ''"
                  >
                    <TaskTableCard
                      v-for="task in executorData.inProgress"
                      :key="task.id"
                      :task="task"
                      :get-avatar-by-email="getAvatarByEmail"
                      :get-display-name-by-email="getDisplayNameByEmail"
                      @open-card="handleOpenCard"
                      class="h-full"
                    />
                  </div>
                </div>

                <!-- Правая колонка: Выполнено -->
                <div class="flex flex-col">
                  <h3 class="text-sm font-medium text-gray-600 mb-2 flex items-center gap-1">
                    <Icon icon="lucide:circle-check-big" class="w-4 h-4" />
                    Выполнено
                    <span class="text-xs text-gray-400">({{ executorData.done.length }})</span>
                  </h3>
                  <div
                    v-if="executorData.done.length === 0"
                    class="text-center text-gray-400 text-sm py-4 flex-1 flex items-center justify-center"
                  >
                    Задач нет
                  </div>
                  <div
                    v-else
                    class="grid gap-2 flex-1"
                    :class="executorData.done.length === 1 ? 'grid-cols-1' : 'grid-cols-2'"
                    :style="executorData.done.length === 1 ? 'grid-template-rows: 1fr' : ''"
                  >
                    <TaskTableCard
                      v-for="task in executorData.done"
                      :key="task.id"
                      :task="task"
                      :get-avatar-by-email="getAvatarByEmail"
                      :get-display-name-by-email="getDisplayNameByEmail"
                      @open-card="handleOpenCard"
                      class="h-full"
                    />
                  </div>
                </div>
              </div>

              <!-- Вертикальный разделитель по центру -->
              <div
                class="absolute left-1/2 top-[60%] -translate-x-1/2 -translate-y-1/2 w-px h-[80%] bg-gray-700"
              ></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Пустое состояние -->
      <div v-if="Object.keys(groupedTasks).length === 0" class="text-center text-gray-500 py-12">
        Задач не найдено
      </div>
    </div>

    <teleport to="body">
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
import TaskOneModal from '@/components/tasks/TaskOneModal.vue'
import TaskTableCard from '@/components/tasks/TaskTableCard.vue'
import AppLoader from '@/components/ui/AppLoader.vue'
import AppModal from '@/components/ui/AppModal.vue'
import AppPage from '@/components/ui/AppPage.vue'
import UserAvatar from '@/components/ui/UserAvatar.vue'
import { Icon } from '@iconify/vue'
import { computed, onMounted, ref } from 'vue'
import { useStore } from 'vuex'

const store = useStore()
const loading = ref(false)

const commentDays = ref(7)
const isCardModalOpen = ref(false)
const selectedTask = ref(null)
const prioritySelectedTask = ref(null)
const titleSelectedTask = ref('')

// Геттеры из стора
const getAvatarByEmail = computed(() => store.getters['users/getAvatarByEmail'])
const getDisplayNameByEmail = computed(() => store.getters['users/getDisplayNameByEmail'])

/**
 * Получает дату последнего комментария
 * @param {Array} comments - массив комментариев задачи
 * @returns {Date|null}
 */
function getLastCommentDate(comments) {
  if (!comments || !Array.isArray(comments) || comments.length === 0) {
    return null
  }

  const validComments = comments.filter((c) => {
    if (!c?.date) return false
    const timestamp = new Date(c.date).getTime()
    return !isNaN(timestamp)
  })

  if (validComments.length === 0) {
    return null
  }

  const latest = validComments.reduce((prev, curr) => {
    return new Date(curr.date) > new Date(prev.date) ? curr : prev
  })

  return new Date(latest.date)
}

/**
 * Базовая фильтрация задач:
 * 1. Исключаем задачи со статусом 'todo' (Планируется)
 * 2. Оставляем только задачи с последним комментарием за последние N дней
 */
function getFilteredTasks() {
  const allTasks = store.getters['tasks/tasks']

  if (!allTasks?.length) {
    return []
  }

  const now = new Date()
  const cutoffDate = new Date(now.getTime() - commentDays.value * 24 * 60 * 60 * 1000)

  return allTasks.filter((task) => {
    // Исключаем задачи со статусом 'todo' (Планируется)
    if (task.status === 'todo') {
      return false
    }

    // Проверяем последний комментарий
    const lastCommentDate = getLastCommentDate(task.comments)
    if (!lastCommentDate) {
      return false
    }

    // Оставляем только задачи с комментарием за последние N дней
    if (lastCommentDate < cutoffDate) {
      return false
    }

    return true
  })
}

/**
 * Группировка задач по первому исполнителю
 * Возвращает объект: { email: { inProgress: [], done: [] } }
 */
const groupedTasks = computed(() => {
  const filtered = getFilteredTasks()
  const grouped = {}

  filtered.forEach((task) => {
    const executorEmail = task.executors?.[0]
    if (!executorEmail) return

    if (!grouped[executorEmail]) {
      grouped[executorEmail] = {
        inProgress: [],
        done: [],
      }
    }

    if (task.status === 'in_progress' || task.status === 'review') {
      grouped[executorEmail].inProgress.push(task)
    } else if (task.status === 'done') {
      grouped[executorEmail].done.push(task)
    }
  })

  // Сортировка исполнителей по имени
  const sortedGrouped = {}
  const sortedEmails = Object.keys(grouped).sort((a, b) => {
    const nameA = getDisplayNameByEmail.value(a) || a
    const nameB = getDisplayNameByEmail.value(b) || b
    return nameA.localeCompare(nameB)
  })

  sortedEmails.forEach((email) => {
    sortedGrouped[email] = grouped[email]
  })

  return sortedGrouped
})

const handleOpenCard = (task) => {
  selectedTask.value = task
  titleSelectedTask.value = task.title
  prioritySelectedTask.value = task?.priority || 'new'
  isCardModalOpen.value = true
}

const handleTaskUpdate = (updatedTask) => {
  if (!updatedTask?.id) {
    console.warn('handleTaskUpdate: получен task без id', updatedTask)
    return
  }

  selectedTask.value = updatedTask
  titleSelectedTask.value = updatedTask.title
  prioritySelectedTask.value = updatedTask.priority

  store.commit('tasks/updateTask', updatedTask)
}

const close = () => {
  isCardModalOpen.value = false
}

onMounted(async () => {
  loading.value = true
  await Promise.all([store.dispatch('tasks/load'), store.dispatch('users/loadAll')])
  loading.value = false
})
</script>

<style scoped>
/* Активные состояния определяют продолжительность и easing */
.slide-top-enter-active,
.slide-top-leave-active {
  transition: all 0.4s ease;
}

.slide-top-enter-from {
  opacity: 0;
  transform: translateY(-100%);
}

.slide-top-enter-to {
  opacity: 1;
  transform: translateY(0);
}

.slide-top-leave-from {
  opacity: 1;
  transform: translateY(0);
}

.slide-top-leave-to {
  opacity: 0;
  transform: translateY(-100%);
}
</style>
