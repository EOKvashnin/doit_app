<template>
  <hr class="text-gray-50/10 w-[90%] mx-auto my-2" />
  <div v-if="tasks.length === 0" class="flex flex-col justify-center items-center gap-4">
    <h4 class="text-center text-gray-400 font-medium">Задач пока нет</h4>
    <Icon icon="streamline-plump:empty-clipboard-remix" class="w-15 h-15 text-gray-300/50" />
  </div>

  <!-- ООСНОВНАЯ ТАБЛИЦА -->

  <div v-else class="w-[90%] mx-auto overflow-hidden grid grid-cols-[1fr_2fr_1fr] gap-4">
    <!-- Колонка 1: Планируются -->
    <div class="flex flex-col border-r border-gray-300/10">
      <!-- Заголовок -->
      <div class="flex justify-between py-2 mr-4">
        <div class="flex items-center gap-2">
          <Icon icon="lucide:square-pen" class="w-5 h-5 text-gray-500 dark:text-gray-300" />
          <h1 class="text-gray-500 dark:text-gray-300 font-medium">Планируются</h1>
          <span class="text-gray-700 font-bold px-1">{{ plannedTasksCount }}</span>
        </div>
        <Icon
          icon="line-md:document-add"
          class="w-6 h-6 text-gray-300 dark:text-gray-700 hover:text-indigo-600 cursor-pointer"
          @click="openModal('todo')"
        />
      </div>

      <!-- Контейнер с задачами и скроллом -->
      <div
        class="flex-1 flex-wrap overflow-y-auto py-2 scrollable-column pr-3"
        :style="{ maxHeight: `calc(100vh - ${hScrollBlock}px)` }"
      >
        <div v-if="plannedTasks.length === 0" class="m-auto flex flex-col items-center gap-1">
          <div class="text-gray-400 text-sm py-4 text-center">Нет задач</div>
          <Icon icon="arcticons:emoji-beach-with-umbrella" class="w-15 h-15 text-gray-400" />
        </div>
        <TransitionGroup name="task" tag="div" class="flex flex-col">
          <TaskTableCard
            v-for="t in plannedTasks"
            :key="t.id"
            :task="t"
            @open-card="emit('open-card', $event)"
            class="mb-3"
          />
        </TransitionGroup>
      </div>
    </div>

    <!-- Колонка 2: В РАБОТЕ -->
    <div class="flex flex-col border-r border-gray-300/10">
      <!-- Заголовок -->
      <div class="flex justify-between py-2 mb-2 mr-4">
        <div class="flex items-center gap-2">
          <Icon icon="line-md:cog-filled-loop" class="w-5 h-5 text-gray-500 dark:text-gray-300" />
          <h1 class="text-gray-500 dark:text-gray-300 font-medium">В работе</h1>
          <span class="text-gray-700 font-bold px-1">{{ inProgressTasksCount }}</span>
        </div>
        <Icon
          icon="line-md:document-add"
          class="w-6 h-6 text-gray-300 dark:text-gray-700 hover:text-indigo-600 cursor-pointer"
          @click="openModal('in_progress')"
        />
      </div>

      <!-- Контейнер с FLEX-WRAP и скроллом -->
      <div
        class="max-h-screen overflow-y-auto flex flex-wrap gap-3 scrollable-column pr-3"
        :style="{ maxHeight: `calc(100vh - ${hScrollBlock}px)` }"
      >
        <div v-if="inProgressTasks.length === 0" class="m-auto flex flex-col items-center gap-1">
          <div class="text-gray-400 text-sm py-4 text-center">Нет задач</div>
          <Icon icon="arcticons:emoji-beach-with-umbrella" class="w-15 h-15 text-gray-400" />
        </div>

        <TaskTableCard
          v-for="t in inProgressTasks"
          :key="t.id"
          :task="t"
          @open-card="emit('open-card', $event)"
          class="flex-1 min-w-[250px]"
        />
      </div>
    </div>

    <!-- Колонка 3:ВЫПОЛНЕНО -->
    <div class="flex flex-col">
      <div class="flex justify-between py-2">
        <div class="flex items-center gap-2">
          <Icon icon="lucide:circle-check-big" class="w-5 h-5 text-gray-500 dark:text-gray-300" />
          <h1 class="text-gray-500 dark:text-gray-300 font-medium">Выполнено</h1>
          <span class="text-gray-700 font-bold px-1">{{ doneTasksCount }}</span>
        </div>
        <Icon
          icon="line-md:document-add"
          class="w-6 h-6 text-gray-300 dark:text-gray-700 hover:text-indigo-600 cursor-pointer"
          @click="openModal('done')"
        />
      </div>

      <div
        class="flex-1 overflow-y-auto py-2 scrollable-column pr-3"
        :style="{ maxHeight: `calc(100vh - ${hScrollBlock}px)` }"
      >
        <div v-if="doneTasks.length === 0" class="flex flex-col items-center gap-1">
          <div class="text-gray-400 text-sm py-4 text-center">Нет задач</div>
          <Icon icon="arcticons:emoji-beach-with-umbrella" class="w-15 h-15 text-gray-400" />
        </div>
        <TransitionGroup name="task" tag="div" class="flex flex-col">
          <TaskTableCard
            v-for="t in doneTasks"
            :key="t.id"
            :task="t"
            @open-card="emit('open-card', $event)"
            class="mb-3"
          />
        </TransitionGroup>
      </div>
    </div>
  </div>
</template>

<script setup>
import TaskTableCard from './TaskTableCard.vue'

import { Icon } from '@iconify/vue'
import { computed, ref } from 'vue'
import { boolean } from 'yup'

const emit = defineEmits(['openModal', 'open-card'])

const props = defineProps({
  tasks: {
    type: Array,
    required: false,
    default: () => [],
  },
  showFilters: {
    type: boolean,
    required: true,
  },
})

/*---- ВЫСОТА СТОЛБЦА В ЗАВВИСИМОСТИ ОТ ОТОБРАЖЕНИЯ ФИЛЬТРА ----*/

const hScrollBlock = ref('190')

if (props.showFilters) {
  hScrollBlock.value = 250
} else {
  hScrollBlock.value = 180
}

/*---- УПРАВЛЕНИЕ МОДАЛЬНЫМ ОКНОМ ------------------------------*/

function openModal(defaultStatus) {
  emit('openModal', defaultStatus) // ← передаём статус как payload
}

/*---- СЧИТАЕМ КОЛИЧЕСТВО ЗАДАЧ ПО СТАТУСАМ --------------------*/

const plannedTasksCount = computed(() => plannedTasks.value.length)
const inProgressTasksCount = computed(() => inProgressTasks.value.length)
const doneTasksCount = computed(() => doneTasks.value.length)

//Создаем карту весов для приоритетов, будем использовать при сортировке по проиотритету
const PRIORITY_ORDER = {
  urgent: 0,
  high: 1,
  medium: 2,
  low: 3,
}

//Функция для получения даты последнего комментария
function getLastCommentDate(comments) {
  if (!comments || comments.length === 0) return null

  const latest = comments.reduce((prev, curr) => {
    const prevDate = new Date(prev.date)
    const currDate = new Date(curr.date)
    return currDate > prevDate ? curr : prev
  })

  return new Date(latest.date)
}

// Функция сортировки задач
function sortTasks(tasks) {
  return [...tasks].sort((a, b) => {
    // 1. Приоритет
    const prioA = PRIORITY_ORDER[a.priority] ?? 999
    const prioB = PRIORITY_ORDER[b.priority] ?? 999
    if (prioA !== prioB) return prioA - prioB

    // 2. Дата последнего комментария
    const dateA = getLastCommentDate(a.comments)
    const dateB = getLastCommentDate(b.comments)

    if (dateA && dateB) return dateB - dateA // новые наверх
    if (dateA) return -1 // a выше
    if (dateB) return 1 // b выше
    return 0 // равны
  })
}

// --- ПРИМЕНЯЕМ В COMPUTED ---

const plannedTasks = computed(() => sortTasks(props.tasks.filter((t) => t.status === 'todo')))

const inProgressTasks = computed(() =>
  sortTasks(props.tasks.filter((t) => ['in_progress', 'review'].includes(t.status))),
)

const doneTasks = computed(() => sortTasks(props.tasks.filter((t) => t.status === 'done')))
</script>

<style scoped>
/* Базовое состояние: все задачи на месте */
.task-enter-from,
.task-leave-to {
  opacity: 0;
  transform: translateX(100%); /* начинаем справа */
}

/* Финальное состояние: на месте */
.task-enter-to {
  opacity: 1;
  transform: translateX(0);
}

/* Анимация появления */
.task-enter-active {
  transition: all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

/* (опционально) Анимация удаления */
.task-leave-active {
  transition: all 0.6s ease;
}
</style>
