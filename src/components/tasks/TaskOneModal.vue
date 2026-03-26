<template>
  <Motion
    :initial="{ opacity: 0, scale: 0.95 }"
    :animate="{ opacity: 1, scale: 1 }"
    :exit="{ opacity: 0, scale: 0.95 }"
    :transition="{ duration: 0.3 }"
    class="task-modal-content px-4 pb-4 pt-2 min-h-[60vh] max-h-[65vh] overflow-y-auto scrollable-column"
  >
    <!-- Header Section -->
    <Motion
      :initial="{ opacity: 0, y: -20 }"
      :animate="{ opacity: 1, y: 0 }"
      :transition="{ delay: 0.1 }"
    >
      <div class="flex flex-row gap-3 justify-between items-baseline mb-2">
        <AppStatus :status="localTask.status" />
        <div class="flex flex-col text-right text-xs text-gray-500 mx-2 mb-1">
          <div v-if="localTask.statusUpdatedAt">
            Статус: {{ formatDateTime(localTask.statusUpdatedAt) }}
          </div>
          <div v-if="localTask.editedAt && localTask.editedAt !== localTask.statusUpdatedAt">
            Изменено: {{ formatDateTime(localTask.editedAt) }}
          </div>
        </div>
      </div>
    </Motion>

    <!-- Title Input -->
    <Motion
      :initial="{ opacity: 0, x: -20 }"
      :animate="{ opacity: 1, x: 0 }"
      :transition="{ delay: 0.2 }"
      class="mb-4 relative"
    >
      <input
        v-model="titleEditable"
        type="text"
        class="input-modal"
        placeholder="Название задачи"
      />
    </Motion>

    <!-- Description -->
    <Motion
      :initial="{ opacity: 0, x: -20 }"
      :animate="{ opacity: 1, x: 0 }"
      :transition="{ delay: 0.3 }"
    >
      <label class="label-modal">Описание</label>
      <textarea
        v-model="descriptionEditable"
        class="area-modal"
        placeholder="Описание задачи"
      ></textarea>
    </Motion>

    <!-- Priority & Deadline Grid -->
    <Motion
      :initial="{ opacity: 0, y: 20 }"
      :animate="{ opacity: 1, y: 0 }"
      :transition="{ delay: 0.4 }"
      class="grid grid-cols-4 gap-4 my-3"
    >
      <div>
        <label class="label-modal">Приоритет</label>
        <select
          v-model="priorityEditable"
          class="select-modal"
          @change="handlePriorityChange($event.target.value)"
        >
          <option value="urgent">🔴 Максимальный</option>
          <option value="high">🟠 Высокий</option>
          <option value="medium">🟢 Средний</option>
          <option value="low">⚫ Низкий</option>
        </select>
      </div>

      <div>
        <label class="label-modal">Дедлайн</label>
        <input v-model="deadlineEditable" type="date" class="input-modal" />
      </div>

      <div>
        <label class="label-modal">Направление</label>
        <input v-model="directionEditable" type="text" class="input-modal" placeholder="..." />
      </div>

      <div>
        <label class="label-modal">Проект (ID)</label>
        <input v-model="projectIdEditable" type="text" class="input-modal" placeholder="..." />
      </div>
    </Motion>

    <!-- Participants Section -->
    <Motion
      :initial="{ opacity: 0 }"
      :animate="{ opacity: 1 }"
      :transition="{ delay: 0.5 }"
      class="border-t my-4 border-gray-400/20"
    >
      <h3 class="label-modal">Участники</h3>
      <TaskParticipantsSplit
        :initiator-email="localTask.initiatorEmail"
        :executor-emails="localTask.executors"
        :get-avatar-by-email="getAvatarByEmail"
        :get-display-name-by-email="getDisplayNameByEmail"
      />
    </Motion>

    <!-- Comments Section -->
    <Motion
      :initial="{ opacity: 0 }"
      :animate="{ opacity: 1 }"
      :transition="{ delay: 0.6 }"
      class="border-t pt-4 border-gray-400/20"
    >
      <h3 class="font-medium mb-2 text-gray-400">Комментарии ({{ localComments.length }})</h3>

      <!-- Новый комментарий -->
      <div class="flex gap-2 mb-3">
        <input
          v-model="newCommentText"
          @keydown.enter.exact.prevent="addComment"
          type="text"
          class="area-modal"
          placeholder="Написать комментарий..."
        />
        <button @click="addComment" class="btn" :disabled="!newCommentText.trim()">
          Отправить
        </button>
      </div>

      <!-- Список комментариев -->
      <div class="space-y-3 max-h-60 pr-2">
        <Motion
          v-for="comment in localComments"
          :key="comment.id"
          :initial="{ opacity: 0, scale: 0.9, y: 20 }"
          :animate="{ opacity: 1, scale: 1, y: 0 }"
          :exit="{ opacity: 0, scale: 0.9, y: -20 }"
          :transition="{ duration: 0.3 }"
          class="relative bg-gray-100/10 dark:bg-gray-700/30 border border-gray-400 dark:border-gray-400/10 rounded-xl py-2 px-3 w-fit ml-auto mb-3"
        >
          <!-- Кнопка удаления -->
          <button
            @click="removeComment(comment.id)"
            class="absolute top-2 right-1 w-5 h-5 flex items-center justify-center rounded-full text-gray-600 hover:text-red-500 transition-colors"
            title="Удалить комментарий"
          >
            <Icon icon="lucide:trash-2" class="w-3 h-3" />
          </button>

          <div class="flex flex-col justify-center items-end">
            <div class="flex flex-row items-center justify-between gap-5 mb-1 pr-4">
              <UserAvatar
                :avatar-url="getAvatarByEmail(comment.authorEmail)"
                :display-name="getDisplayNameByEmail(comment.authorEmail)"
                :tooltip="true"
                :tooltip-name="getDisplayNameByEmail(comment.authorEmail)"
                :editable="false"
                :size="24"
              />
              <span class="text-gray-500 text-xs">{{ formatDateTime(comment.date) }}</span>
            </div>
            <p class="text-gray-800 dark:text-gray-200 text-sm text-right">
              {{ comment.text }}
            </p>
          </div>
        </Motion>
      </div>
    </Motion>
  </Motion>

  <!-- Footer with Animation -->
  <Motion
    :initial="{ opacity: 0, y: 20 }"
    :animate="{ opacity: 1, y: 0 }"
    :transition="{ delay: 0.7 }"
    class="mt-2 py-3 px-3 rounded-xl flex justify-end items-center gap-3 bg-gray-400/30 dark:bg-gray-800/50 backdrop-blur-[20px] border-t border-gray-400/20"
  >
    <button class="btn-del flex justify-start items-center gap-2" @click="removeWithConfirm">
      <Icon icon="lucide:trash-2" class="w-4 h-4 text-white" />
      Удалить
    </button>

    <div class="form-control w-full">
      <select
        class="select-modal"
        v-model="localTask.status"
        @change="handleStatusChange($event.target.value)"
      >
        <option value="" disabled selected hidden>Обновить статус</option>
        <option value="todo">📋 Планируется</option>
        <option value="in_progress">⚙️ В работе</option>
        <option value="review">🔍 Тестирование</option>
        <option value="done">✅ Завершено</option>
      </select>
    </div>

    <Motion
      v-if="hasChanges"
      :initial="{ opacity: 0, x: 30 }"
      :animate="{ opacity: 1, x: 0 }"
      :exit="{ opacity: 0, x: 30 }"
      :transition="{ duration: 0.3 }"
      class="inline-block"
    >
      <button @click="updateTask" class="btn">Обновить</button>
    </Motion>

    <button @click="closeModal" class="btn transition-colors duration-300">Закрыть</button>
  </Motion>

  <ConfirmModal
    :visible="showConfirmModal"
    message="Вы уверены, что хотите удалить задачу?"
    @confirm="confirmRemove"
    @cancel="cancelRemove"
  />
</template>

<script setup>
import { CommentService } from '@/services/commentService'
import { TaskService } from '@/services/taskService'
import { dateFormatter } from '@/utils/dateFormatter'
import { showToast } from '@/utils/toast'
import { Motion } from 'motion-v'
import { computed, ref, shallowRef, watch } from 'vue'
import { useStore } from 'vuex'

// Components - ИМПОРТИРУЕМ ВСЕ НЕОБХОДИМЫЕ КОМПОНЕНТЫ
import { Icon } from '@iconify/vue'
import AppStatus from '../ui/AppStatus.vue'
import ConfirmModal from '../ui/ConfirmModal.vue'
import TaskParticipantsSplit from '../ui/TaskParticipantsSplit.vue'
import UserAvatar from '../ui/UserAvatar.vue'

// ==================================================
// 🔌 ИНИЦИАЛИЗАЦИЯ И ВНЕШНИЕ ЗАВИСИМОСТИ
// ==================================================

const store = useStore()
const taskService = new TaskService(store)

const props = defineProps({
  task: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['close', 'update'])

// ==================================================
// 🎛 УПРАВЛЕНИЕ МОДАЛЬНЫМ ОКНОМ
// ==================================================

const closeModal = () => emit('close')
const showConfirmModal = ref(false)

// ==================================================
// 🧠 ЛОКАЛЬНОЕ СОСТОЯНИЕ КОМПОНЕНТА
// ==================================================

const localTask = shallowRef({ ...props.task })
const originalStatus = ref(props.task.status || '')
const originalPriority = ref(props.task.priority || '')

// Редактируемые поля
const titleEditable = ref('')
const descriptionEditable = ref('')
const priorityEditable = ref('medium')
const deadlineEditable = ref('')
const directionEditable = ref('')
const projectIdEditable = ref('')

const localComments = ref([])
const newCommentText = ref('')

// ==================================================
// 🔄 СИНХРОНИЗАЦИЯ С ВНЕШНИМИ ИЗМЕНЕНИЯМИ
// ==================================================

watch(
  () => props.task,
  (newTask) => {
    if (!newTask) return

    titleEditable.value = newTask.title || ''
    descriptionEditable.value = newTask.description || ''
    priorityEditable.value = newTask.priority || 'medium'
    deadlineEditable.value = newTask.deadline || ''
    directionEditable.value = newTask.direction || ''
    projectIdEditable.value = newTask.projectId || ''

    localTask.value = {
      ...newTask,
      initiatorEmail: newTask.initiatorEmail || null,
      executors: Array.isArray(newTask.executors) ? [...newTask.executors] : [],
    }

    localComments.value = Array.isArray(newTask.comments) ? [...newTask.comments] : []
  },
  { immediate: true, deep: false },
)

// ==================================================
// 📅 ФОРМАТИРОВАНИЕ ДАТ
// ==================================================

const formatDateTime = (date) => {
  if (!date) return ''
  return dateFormatter.formatDateTime(date)
}

// ==================================================
// 👤 ГЕТТЕРЫ ДЛЯ ПОЛЬЗОВАТЕЛЕЙ
// ==================================================

const currentUserEmail = computed(() => store.getters['auth/userEmail'])
const getAvatarByEmail = (email) => store.getters['users/getAvatarByEmail'](email)
const getDisplayNameByEmail = (email) => store.getters['users/getDisplayNameByEmail'](email)

// ==================================================
// 🔍 ПРОВЕРКА НАЛИЧИЯ ИЗМЕНЕНИЙ
// ==================================================

const hasChanges = computed(() => {
  if (!props.task) return false

  const executorsChanged = !arraysEqual(localTask.value.executors || [], props.task.executors || [])

  return (
    titleEditable.value.trim() !== (props.task.title || '') ||
    descriptionEditable.value.trim() !== (props.task.description || '') ||
    priorityEditable.value !== (props.task.priority || 'medium') ||
    deadlineEditable.value !== (props.task.deadline || '') ||
    directionEditable.value.trim() !== (props.task.direction || '') ||
    projectIdEditable.value.trim() !== (props.task.projectId || '') ||
    (localTask.value.initiatorEmail || '') !== (props.task.initiatorEmail || '') ||
    executorsChanged
  )
})

function arraysEqual(arr1, arr2) {
  if (arr1.length !== arr2.length) return false
  return arr1.every((item, index) => item === arr2[index])
}

// ==================================================
// 📤 ОБНОВЛЕНИЕ ДАННЫХ ЗАДАЧИ
// ==================================================

const updateTask = async () => {
  if (!props.task?.id || !hasChanges.value) return

  try {
    const updatedData = await taskService.updateTask(props.task.id, {
      title: titleEditable.value.trim(),
      description: descriptionEditable.value.trim(),
      priority: priorityEditable.value,
      deadline: deadlineEditable.value,
      direction: directionEditable.value.trim(),
      projectId: projectIdEditable.value.trim(),
      initiatorEmail: localTask.value.initiatorEmail,
      executors: [...localTask.value.executors],
    })

    localTask.value = updatedData
    originalStatus.value = updatedData.status
    originalPriority.value = updatedData.priority

    emit('update', updatedData)
  } catch (error) {
    resetToOriginalState()
  }
}

const resetToOriginalState = () => {
  if (!props.task) return

  titleEditable.value = props.task.title || ''
  descriptionEditable.value = props.task.description || ''
  priorityEditable.value = props.task.priority || 'medium'
  deadlineEditable.value = props.task.deadline || ''
  directionEditable.value = props.task.direction || ''
  projectIdEditable.value = props.task.projectId || ''

  localTask.value = { ...props.task }
  originalStatus.value = props.task.status || ''
  originalPriority.value = props.task.priority || 'medium'
}

// ==================================================
// 🟢 ОБНОВЛЕНИЕ СТАТУСА
// ==================================================

const handleStatusChange = async (value) => {
  if (value === originalStatus.value) return

  try {
    const updatedData = await taskService.updateField(props.task.id, 'status', value)

    // ✅ Создаём полный объект задачи
    const completeTask = {
      ...props.task,
      ...updatedData,
      status: value,
      statusUpdatedAt: new Date().toISOString(),
      editedAt: new Date().toISOString(),
    }

    localTask.value = completeTask
    originalStatus.value = value
    emit('update', completeTask)
  } catch (error) {
    showToast.error('Не удалось обновить статус')
    localTask.value = { ...props.task }
  }
}

// ==================================================
// 🟠 ОБНОВЛЕНИЕ ПРИОРИТЕТА
// ==================================================

const handlePriorityChange = async (value) => {
  if (value === originalPriority.value) return

  try {
    const updatedData = await taskService.updateField(props.task.id, 'priority', value)

    // ✅ ВАЖНО: создаём полный объект задачи, а не смешиваем
    const completeTask = {
      ...props.task, // берём оригинальную задачу как базу
      ...updatedData, // применяем обновления с сервера
      priority: value, // явно устанавливаем новый приоритет
      editedAt: new Date().toISOString(), // обновляем время редактирования
    }

    // ✅ Обновляем localTask полностью
    localTask.value = completeTask
    originalPriority.value = value

    // ✅ Emit'им полный корректный объект
    emit('update', completeTask)
  } catch (error) {
    showToast.error('Не удалось обновить приоритет')
    priorityEditable.value = props.task.priority || 'medium'
    // ✅ При ошибке восстанавливаем из props.task
    localTask.value = { ...props.task }
  }
}

// ==================================================
// 💬 РАБОТА С КОММЕНТАРИЯМИ
// ==================================================

const commentService = new CommentService(store, props.task.id)

const addComment = async () => {
  const text = newCommentText.value.trim()
  if (!text) return

  const newComment = {
    id: Date.now().toString(),
    authorEmail: currentUserEmail.value,
    date: new Date().toISOString(),
    text,
  }

  // Optimistic UI
  localComments.value.unshift(newComment)
  newCommentText.value = ''

  try {
    await commentService.addComment(text, currentUserEmail.value)
  } catch (error) {
    localComments.value = localComments.value.filter((c) => c.id !== newComment.id)
  }
}

const removeComment = async (commentId) => {
  const commentIndex = localComments.value.findIndex((c) => c.id === commentId)
  if (commentIndex === -1) return

  const removedComment = localComments.value.splice(commentIndex, 1)[0]

  try {
    await commentService.removeComment(commentId)
  } catch (error) {
    localComments.value.splice(commentIndex, 0, removedComment)
  }
}

// ==================================================
// 🗑 УДАЛЕНИЕ ЗАДАЧИ
// ==================================================

const removeWithConfirm = () => {
  showConfirmModal.value = true
}

const cancelRemove = () => {
  showConfirmModal.value = false
}

const confirmRemove = async () => {
  try {
    await store.dispatch('tasks/remove', props.task.id)
    showToast.success('Задача удалена', {
      position: 'bottom-right',
      autoClose: 1500,
      transition: 'zoom',
    })
    emit('close')
  } catch (error) {
    showToast.error('Ошибка при удалении', error)
  } finally {
    showConfirmModal.value = false
  }
}
</script>

<style scoped>
.task-modal-content {
  font-size: 14px;
}
</style>
