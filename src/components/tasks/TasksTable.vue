<template>
  <hr class="text-gray-50/10 w-[90%] mx-auto my-2" />

  <!-- Пустое состояние -->
  <EmptyState v-if="tasks.length === 0" />

  <!-- Основная таблица -->
  <template v-else>
    <Motion
      :initial="{ opacity: 0 }"
      :animate="{ opacity: 1 }"
      :transition="{ duration: 0.3 }"
      class="w-[90%] mx-auto overflow-hidden grid grid-cols-[1fr_2fr_1fr] gap-4"
    >
      <!-- Генерируем колонки динамически -->
      <ColumnContainer
        v-for="column in columns"
        :key="column.id"
        :column="column"
        :tasks="columnTasks[column.id]"
        :get-avatar-by-email="getAvatarByEmail"
        :get-display-name-by-email="getDisplayNameByEmail"
        :h-scroll-block="hScrollBlock"
        @open-modal="openModal"
        @open-card="handleOpenCard"
      />
    </Motion>
  </template>
</template>

<script setup>
import { Motion } from 'motion-v'
import { computed, onMounted, onUnmounted, watch } from 'vue'
import { useStore } from 'vuex'
import ColumnContainer from './ColumnContainer.vue'
import EmptyState from './EmptyState.vue'

const store = useStore()
const emit = defineEmits(['openModal', 'open-card'])

const props = defineProps({
  tasks: {
    type: Array,
    required: false,
    default: () => [],
  },
  showFilters: {
    type: Boolean,
    required: true,
  },
})

// ==================== КОНФИГУРАЦИЯ КОЛОНОК ====================
const COLUMN_CONFIG = [
  {
    id: 'todo',
    title: 'Планируются',
    icon: 'lucide:square-pen',
    status: ['todo'],
    layout: 'column',
    addIcon: 'line-md:document-add',
    emptyIcon: 'arcticons:emoji-beach-with-umbrella',
  },
  {
    id: 'in_progress',
    title: 'В работе',
    icon: 'line-md:cog-filled-loop',
    status: ['in_progress', 'review'],
    layout: 'grid',
    addIcon: 'line-md:document-add',
    emptyIcon: 'arcticons:emoji-beach-with-umbrella',
  },
  {
    id: 'done',
    title: 'Выполнено',
    icon: 'lucide:circle-check-big',
    status: ['done'],
    layout: 'column',
    addIcon: 'line-md:document-add',
    emptyIcon: 'arcticons:emoji-beach-with-umbrella',
  },
]

// ==================== ВЫСОТА СКРОЛЛА ====================
const hScrollBlock = computed(() => (props.showFilters ? 250 : 180))

// ==================== ГЕТТЕРЫ ИЗ СТОРА ====================
const getAvatarByEmail = computed(() => store.getters['users/getAvatarByEmail'])
const getDisplayNameByEmail = computed(() => store.getters['users/getDisplayNameByEmail'])

// ==================== 🎯 ЛОГИКА СОРТИРОВКИ ====================

/**
 * 📊 Порядок приоритетов для сортировки (меньше = выше)
 */
const PRIORITY_ORDER = Object.freeze({
  urgent: 0, // 🔴 Максимальный
  high: 1, // 🟠 Высокий
  medium: 2, // 🟢 Средний
  low: 3, // ⚫ Низкий
  default: 999, // Задачи без приоритета — в самый конец
})

/**
 * 🔍 Кэш для дат последних комментариев (мемоизация)
 * Ключ: taskId, Значение: Date|null
 */
const commentDateCache = new Map()

/**
 * 🔍 Получает дату последнего комментария (валидную Date или null)
 * @param {string} taskId - ID задачи для кэширования
 * @param {Array} comments - массив комментариев задачи
 * @returns {Date|null}
 */
function getLastCommentDate(taskId, comments) {
  // Проверяем кэш
  if (commentDateCache.has(taskId)) {
    return commentDateCache.get(taskId)
  }

  // Базовая валидация
  if (!comments || !Array.isArray(comments) || comments.length === 0) {
    commentDateCache.set(taskId, null)
    return null
  }

  // Фильтруем только комментарии с валидной датой
  const validComments = comments.filter((c) => {
    if (!c?.date) return false
    const timestamp = new Date(c.date).getTime()
    return !isNaN(timestamp) // true только для корректных дат ISO
  })

  if (validComments.length === 0) {
    commentDateCache.set(taskId, null)
    return null
  }

  // Находим комментарий с максимальной датой
  const latest = validComments.reduce((prev, curr) => {
    return new Date(curr.date) > new Date(prev.date) ? curr : prev
  })

  const result = new Date(latest.date)
  commentDateCache.set(taskId, result)
  return result
}

/**
 * 🔄 Двухуровневая сортировка задач:
 * 1. По приоритету (ascending: urgent → low)
 * 2. Внутри одного приоритета — по дате последнего комментария (descending: новые сверху)
 *
 * @param {Array} tasks - массив задач для сортировки
 * @returns {Array} отсортированный массив (новая ссылка, иммутабельно)
 */
function sortTasks(tasks) {
  return [...tasks].sort((a, b) => {
    // 🛡️ Защита от невалидных данных
    if (!a?.id || !a?.status) return 1
    if (!b?.id || !b?.status) return -1

    // ─────────────────────────────────────────
    // 🔹 КРИТЕРИЙ 1: Сортировка по приоритету
    // ─────────────────────────────────────────
    const priorityA = PRIORITY_ORDER[a.priority] ?? PRIORITY_ORDER.default
    const priorityB = PRIORITY_ORDER[b.priority] ?? PRIORITY_ORDER.default

    // Если приоритеты разные — сортируем по ним и завершаем сравнение
    if (priorityA !== priorityB) {
      return priorityA - priorityB // ascending: 0 < 1 < 2 < 3
    }

    // ─────────────────────────────────────────
    // 🔹 КРИТЕРИЙ 2: Сортировка по дате комментария (внутри одного приоритета)
    // ─────────────────────────────────────────
    const dateA = getLastCommentDate(a.id, a.comments)
    const dateB = getLastCommentDate(b.id, b.comments)

    // Если у обеих задач нет валидных дат комментариев — сохраняем относительный порядок
    if (!dateA && !dateB) return 0

    // Задача с комментарием всегда выше задачи без комментариев
    if (!dateA) return 1 // a без даты → ниже
    if (!dateB) return -1 // b без даты → ниже

    // Сортируем по убыванию: новые комментарии сверху
    return dateB - dateA
  })
}

// ==================== ФИЛЬТРАЦИЯ И СОРТИРОВКА ПО КОЛОНКАМ ====================
const columnTasks = computed(() => {
  const result = {}

  COLUMN_CONFIG.forEach((column) => {
    // 1. Фильтрация задач по статусам колонки
    const filtered = props.tasks.filter((task) => {
      if (!task || !task.id || !task.status) return false
      return column.status.includes(task.status)
    })

    // 2. 🎯 Сортировка отфильтрованных задач
    result[column.id] = sortTasks(filtered)
  })

  return result
})

// ==================== КОЛИЧЕСТВО ЗАДАЧ ====================
const tasksCount = computed(() => {
  const counts = {}
  COLUMN_CONFIG.forEach((column) => {
    counts[column.id] = columnTasks.value[column.id]?.length || 0
  })
  return counts
})

// ==================== КОЛОНКИ С КОЛИЧЕСТВОМ ====================
const columns = computed(() =>
  COLUMN_CONFIG.map((column) => ({
    ...column,
    count: tasksCount.value[column.id],
  })),
)

// ==================== МЕТОДЫ ====================
function openModal(defaultStatus) {
  emit('openModal', defaultStatus)
}

function handleOpenCard(event) {
  emit('open-card', event)
}

// ==================== ЖИЗНЕННЫЙ ЦИКЛ ====================
onMounted(() => {
  if (store.state.users.allUsers.length === 0) {
    store.dispatch('users/loadAll').catch((err) => {
      console.error('Ошибка загрузки пользователей:', err)
    })
  }
})

// ✅ Очистка кэша комментариев при изменении задач
watch(
  () => props.tasks,
  () => {
    // Очищаем кэш при изменении набора задач
    commentDateCache.clear()
  },
  { deep: false }, // Следим только за ссылкой на массив
)

// ✅ Очистка кэша при размонтировании компонента
onUnmounted(() => {
  commentDateCache.clear()
})
</script>
