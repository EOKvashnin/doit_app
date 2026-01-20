<template>
  <div
    class="task-modal-content px-4 pb-4 pt-2 min-h-[60vh] max-h-[65vh] overflow-y-auto scrollable-column"
  >
    <div class="flex flex-row gap-3 justify-between items-baseline mb-2">
      <AppStatus :status="localTask.status" />
      <div class="flex flex-col text-right text-xs text-gray-500 mx-2 mb-1">
        <div v-if="localTask.statusUpdatedAt">
          Статус:
          {{
            new Intl.DateTimeFormat('ru-RU', { dateStyle: 'short', timeStyle: 'short' }).format(
              new Date(localTask.statusUpdatedAt),
            )
          }}
        </div>
        <div v-if="localTask.editedAt && localTask.editedAt !== localTask.statusUpdatedAt">
          Изменено:
          {{
            new Intl.DateTimeFormat('ru-RU', { dateStyle: 'short', timeStyle: 'short' }).format(
              new Date(localTask.editedAt),
            )
          }}
        </div>
      </div>
    </div>
    <!-- Заголовок -->
    <div class="mb-4 relative">
      <input
        v-model="titleEditable"
        type="text"
        class="input-modal"
        placeholder="Название задачи"
      />
    </div>

    <!-- Статус и приоритет -->
    <div>
      <label class="label-modal">Описание</label>
      <textarea
        v-model="descriptionEditable"
        class="area-modal"
        placeholder="Описание задачи"
      ></textarea>
    </div>

    <div class="grid grid-cols-4 gap-4 my-3">
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
    </div>

    <!-- Ответственные -->

    <div class="border-t my-4 border-gray-400/20">
      <h3 class="label-modal">Участники</h3>
      <TaskParticipants
        :lead-email="localTask.leadEmail"
        :assignee-email="localTask.assigneeEmail"
        :author-email="localTask.authorEmail"
      />
    </div>

    <!-- Комментарии -->
    <div class="border-t pt-4 border-gray-400/20">
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
        <TransitionGroup name="comment" tag="div" class="space-y-3 max-h-60 pr-2">
          <div
            v-for="comment in localComments"
            :key="comment.id"
            class="relative bg-gray-100/10 dark:bg-gray-700/30 border border-gray-400 dark:border-gray-400/10 rounded-xl py-2 px-3 w-fit ml-auto mb-3"
          >
            <!-- Кнопка удаления в правом верхнем углу -->
            <button
              @click="removeComment(comment.id)"
              class="absolute top-2 right-1 w-5 h-5 flex items-center justify-center rounded-full text-gray-600 hover:text-red-500 transition-colors"
              title="Удалить комментарий"
            >
              <Icon icon="lucide:trash-2" class="w-3 h-3" />
            </button>

            <div class="flex flex-col justify-center items-end">
              <div class="flex flex-row items-center justify-between gap-5 mb-1 pr-4">
                <div class="relative group inline-flex">
                  <UserAvatar
                    :avatar-url="getAvatarByEmail(comment.authorEmail)"
                    :display-name="getDisplayNameByEmail(comment.authorEmail)"
                    :editable="false"
                    :size="24"
                  />
                  <!-- Tooltip -->
                  <div
                    v-if="authorDisplayName(comment)"
                    class="flex flex-col items-center gap-2 absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-2 py-1 bg-indigo-600 text-white text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-10 whitespace-nowrap pointer-events-none"
                  >
                    <UserAvatar
                      :avatar-url="getAvatarByEmail(comment.authorEmail)"
                      :display-name="getDisplayNameByEmail(comment.authorEmail)"
                      :editable="false"
                      :size="80"
                    />
                    {{ authorDisplayName(comment) }}
                  </div>
                </div>

                <!-- Дата -->
                <span class="text-gray-500 text-xs">{{
                  new Intl.DateTimeFormat('ru-RU', {
                    dateStyle: 'short',
                    timeStyle: 'short',
                  }).format(new Date(comment.date))
                }}</span>
              </div>
              <p class="text-gray-800 dark:text-gray-200 text-sm text-right">
                {{ comment.text }}
              </p>
            </div>
          </div>
        </TransitionGroup>
      </div>
    </div>
  </div>
  <!-- ----------------- FOOTER  ------------------- -->
  <div
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
        id="cur_status"
        @change="handleSelectChange($event.target.value)"
      >
        <option value="" disabled selected hidden>Обновить статус</option>
        <option value="todo">📋 Планируется</option>
        <option value="in_progress">⚙️ В работе</option>
        <option value="review">🔍 Тестирование</option>
        <option value="done">✅ Завершено</option>
      </select>
    </div>

    <transition name="slide-fade">
      <div v-if="hasChanges" class="inline-block">
        <button @click="UpdateWorkerData" class="btn">Обновить</button>
      </div>
    </transition>
    <button @click="closeModal" class="btn transition-colors duration-300">Закрыть</button>
  </div>
  <ConfirmModal
    :visible="showConfirmModal"
    message="Вы уверены, что хотите удалить задачу?"
    @confirm="confirmRemove"
    @cancel="cancelRemove"
  />
</template>

<script setup>
import { showToast } from '@/utils/toast'
import { Icon } from '@iconify/vue'
import { computed, ref, watch } from 'vue'
import { useStore } from 'vuex'
import AppStatus from '../ui/AppStatus.vue'
import ConfirmModal from '../ui/ConfirmModal.vue'
import TaskParticipants from '../ui/TaskParticipants.vue'
import UserAvatar from '../ui/UserAvatar.vue'

// ==================================================
// 🔌 ИНИЦИАЛИЗАЦИЯ И ВНЕШНИЕ ЗАВИСИМОСТИ
// ==================================================

const store = useStore()

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
// — копии полей задачи для редактирования
// — локальное хранилище комментариев (для мгновенного отображения)
// ==================================================

// Создаём локальную копию задачи для редактирования
const localTask = ref({ ...props.task })

// Исходные значения для сравнения (чтобы не отправлять лишние обновления)
const originalStatus = ref(props.task.status || '')
const originalPriority = ref(props.task.priority || '')

// Редактируемые текстовые поля
const titleEditable = ref('')
const descriptionEditable = ref('')
const priorityEditable = ref('medium')
const deadlineEditable = ref('')
const directionEditable = ref('')
const projectIdEditable = ref('')
const authorFioEditable = ref('')
const assigneeFioEditable = ref('')
const leadFioEditable = ref('')

// Локальный массив комментариев (для optimistic UI)
const localComments = ref([])

// ==================================================
// 🔄 СИНХРОНИЗАЦИЯ С ВНЕШНИМИ ИЗМЕНЕНИЯМИ (props.task)
// — обновление локального состояния при изменении входной задачи
// ==================================================

watch(
  () => props.task,
  (newTask) => {
    if (newTask) {
      // Синхронизируем редактируемые поля с новой задачей
      titleEditable.value = newTask.title || ''
      descriptionEditable.value = newTask.description || ''
      priorityEditable.value = newTask.priority || 'medium'
      deadlineEditable.value = newTask.deadline || ''
      directionEditable.value = newTask.direction || ''
      projectIdEditable.value = newTask.projectId || ''
      authorFioEditable.value = newTask.authorFio || ''
      assigneeFioEditable.value = newTask.assigneeFio || ''
      leadFioEditable.value = newTask.leadFio || ''
      // Инициализируем локальные комментарии
      localComments.value = Array.isArray(newTask.comments) ? [...newTask.comments] : []
    } else {
      // Сброс состояния при закрытии или отсутствии задачи
      titleEditable.value = ''
      descriptionEditable.value = ''
      priorityEditable.value = 'medium'
      deadlineEditable.value = ''
      directionEditable.value = ''
      projectIdEditable.value = ''
      authorFioEditable.value = ''
      assigneeFioEditable.value = ''
      leadFioEditable.value = ''
    }
  },
  { immediate: true },
)

// ==================================================
// 🔍 ПРОВЕРКА НАЛИЧИЯ ИЗМЕНЕНИЙ (для отображения кнопки "Обновить")
// ==================================================

const hasChanges = computed(() => {
  if (!props.task) return false

  return (
    titleEditable.value.trim() !== (props.task.title || '') ||
    descriptionEditable.value.trim() !== (props.task.description || '') ||
    priorityEditable.value !== (props.task.priority || 'medium') ||
    deadlineEditable.value !== (props.task.deadline || '') ||
    directionEditable.value.trim() !== (props.task.direction || '') ||
    projectIdEditable.value.trim() !== (props.task.projectId || '') ||
    authorFioEditable.value.trim() !== (props.task.authorFio || '') ||
    assigneeFioEditable.value.trim() !== (props.task.assigneeFio || '') ||
    leadFioEditable.value.trim() !== (props.task.leadFio || '')
  )
})

// ==================================================
// 📤 ОБНОВЛЕНИЕ ДАННЫХ ЗАДАЧИ (массовое)
// — вызывается по кнопке "Обновить"
// ==================================================

const UpdateWorkerData = async () => {
  if (!props.task?.id) return

  try {
    const now = new Date().toISOString()
    const updatedData = {
      ...props.task,
      title: titleEditable.value.trim(),
      description: descriptionEditable.value.trim(),
      priority: priorityEditable.value,
      deadline: deadlineEditable.value,
      direction: directionEditable.value.trim(),
      projectId: projectIdEditable.value.trim(),
      authorFio: authorFioEditable.value.trim(),
      assigneeFio: assigneeFioEditable.value.trim(),
      leadFio: leadFioEditable.value.trim(),
      comments: localTask.value.comments || props.task.comments,
      editedAt: now,
    }

    // Сохраняем в Vuex и на сервере
    store.commit('tasks/updateTask', updatedData)
    await store.dispatch('tasks/update', {
      id: props.task.id,
      data: updatedData,
    })

    // Обновляем локальное состояние
    localTask.value = updatedData
    originalStatus.value = updatedData.status
    originalPriority.value = updatedData.priority

    // Уведомляем родителя
    emit('update', updatedData)
    showToast.success('Данные успешно обновлены')
  } catch (error) {
    // Откат при ошибке
    localTask.value = { ...props.task }
    originalStatus.value = props.task.status || ''
    originalPriority.value = props.task.priority || 'medium'

    // Восстанавливаем поля ввода
    titleEditable.value = props.task.title || ''
    descriptionEditable.value = props.task.description || ''
    priorityEditable.value = props.task.priority || 'medium'
    deadlineEditable.value = props.task.deadline || ''
    directionEditable.value = props.task.direction || ''
    projectIdEditable.value = props.task.projectId || ''
    authorFioEditable.value = props.task.authorFio || ''
    assigneeFioEditable.value = props.task.assigneeFio || ''
    leadFioEditable.value = props.task.leadFio || ''

    showToast.error('Не удалось сохранить изменения: ' + (error.message || 'неизвестная ошибка'))
  }
}

// ==================================================
// 🟢 ОБНОВЛЕНИЕ СТАТУСА (отдельно, с отметкой времени)
// ==================================================

const handleSelectChange = async (value) => {
  if (value === originalStatus.value) return
  await updateStatus(value)
}

const updateStatus = async (status) => {
  try {
    const now = new Date().toISOString()
    const updatedTask = {
      ...localTask.value,
      status,
      statusUpdatedAt: now,
      editedAt: now,
    }

    localTask.value = updatedTask
    store.commit('tasks/updateTask', updatedTask)
    await store.dispatch('tasks/update', {
      id: props.task.id,
      data: updatedTask,
    })

    originalStatus.value = status
    emit('update', updatedTask)
    showToast.success('Статус успешно обновлён')
  } catch (e) {
    localTask.value = { ...props.task }
    showToast.error('Ошибка: ' + e.message)
  }
}

// ==================================================
// 🟠 ОБНОВЛЕНИЕ ПРИОРИТЕТА (отдельно, с отметкой editedAt)
// ==================================================

const handlePriorityChange = async (value) => {
  if (value === originalPriority.value) return
  await updatePriority(value)
}

const updatePriority = async (priority) => {
  try {
    const now = new Date().toISOString()
    localTask.value = {
      ...localTask.value,
      priority,
      editedAt: now,
    }

    store.commit('tasks/updateTask', localTask.value)
    await store.dispatch('tasks/update', {
      id: props.task.id,
      data: localTask.value,
    })

    emit('update', localTask.value)
    originalPriority.value = priority
    showToast.success('Приоритет успешно обновлён')
  } catch (e) {
    localTask.value = { ...props.task }
    priorityEditable.value = props.task.priority || 'medium'
    showToast.error('Ошибка: ' + e.message)
  }
}

// ==================================================
// 🗑 УДАЛЕНИЕ ЗАДАЧИ (с подтверждением)
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
    showToast.error('Ошибка при удалении ', error)
  } finally {
    showConfirmModal.value = false
  }
}

// ==================================================
// 💬 РАБОТА С КОММЕНТАРИЯМИ (optimistic update)
// — комментарий появляется мгновенно, отправка — в фоне
// ==================================================

// Получаем email текущего пользователя из Vuex
const currentUserEmail = computed(() => store.getters['auth/userEmail'])
// Геттеры
const getAvatarByEmail = (email) => store.getters['users/getAvatarByEmail'](email)
const getDisplayNameByEmail = (email) => store.getters['users/getDisplayNameByEmail'](email)
const newCommentText = ref('')

const authorDisplayName = (comment) => {
  if (!comment.authorEmail) return ''
  return getDisplayNameByEmail(comment.authorEmail) || comment.authorEmail
}

const addComment = async () => {
  const text = newCommentText.value.trim()
  if (!text) return

  const newComment = {
    id: Date.now().toString(),
    authorEmail: currentUserEmail.value,
    date: new Date().toISOString(),
    text,
  }

  // Optimistic UI: сразу добавляем в интерфейс
  localComments.value.unshift(newComment)
  newCommentText.value = ''

  try {
    // Отправляем на сервер
    await store.dispatch('tasks/addComment', {
      taskId: props.task.id,
      comment: newComment,
    })
  } catch (error) {
    // Ошибка — откатываем
    localComments.value = localComments.value.filter((c) => c.id !== newComment.id)
    showToast.error('Не удалось сохранить комментарий', error)
  }
}
//----------------   УДАЛЕНИЕ КОММЕНТАРИЯ   ----------------

const removeComment = async (commentId) => {
  // Optimistic UI: сразу удаляем из локального массива
  const commentIndex = localComments.value.findIndex((c) => c.id === commentId)
  if (commentIndex === -1) return

  const removedComment = localComments.value.splice(commentIndex, 1)[0]

  try {
    await store.dispatch('tasks/removeComment', {
      taskId: props.task.id,
      commentId,
    })
    // Успех — комментарий уже удалён из localComments (optimistic)
  } catch (error) {
    // Откат: возвращаем комментарий на место
    localComments.value.splice(commentIndex, 0, removedComment)
    // Ошибка уже показана в action через showToast
  }
}
</script>

<style scoped>
.task-modal-content {
  font-size: 14px;
}

.adaptive-modal {
  max-height: min(80vh, 800px); /* Не больше 80% экрана и 800px */
  min-height: 400px; /* Минимальная высота */
  overflow-y: auto;
  scrollbar-gutter: stable both-edges; /* Зарезервируем место под скроллбар */
  padding-right: 8px;
}
.scroll-always {
  overflow-y: scroll; /* Принудительное отображение скролла */
  overscroll-behavior: contain; /* Контроль эффекта перекатывания */
}

.ease-out-back {
  animation-timing-function: cubic-bezier(0.34, 1.56, 0.64, 1);
}

/* ---------- ADD_COMMENT_BLOCK ---------------- */

.addComment-enter-active,
.addComment-leave-active {
  transition: all 0.8s ease;
  max-height: 200px;
  opacity: 1;
}

.addComment-enter-from,
.addComment-leave-to {
  max-height: 0;
  opacity: 0;
  overflow: hidden;
}

/* ---------- ADD_COMMENT_LIST ---------------- */

.list-enter-from {
  opacity: 0;
  transform: scale(0.6);
}

.list-enter-active {
  transition: all 0.6s ease;
}

.list-leave-to {
  opacity: 0;
  transform: scale(0.6);
}
.list-leave-active {
  transition: all 0.6s ease;
  position: absolute;
}
.list-move {
  transition: all 0.6s ease;
}

/* ---------------- ANIMATION_ADD_BTN ---------------- */

.addBtn-enter-from,
.addBtn-leave-to {
  opacity: 0;
}
.addBtn-enter-active,
.addBtn-leave-active {
  transition: all 0.6s ease;
}

/* ---------------- ANIMATION_FOOTER ------------------*/

.footer-enter-active,
.footer-leave-active {
  transition: all 0.6s ease;
  transform: translateY(0);
}

.footer-enter-from,
.footer-leave-to {
  transform: translateY(30%);
  opacity: 0;
}

/*-------------- INPUT_FOOTER ----------------------- */

.input-wrapper {
  width: 280px; /* или любая подходящая фиксированная ширина */
}

.input-width-enter-active,
.input-width-leave-active {
  transition:
    width 0.6s ease,
    opacity 0.6s ease;
  overflow: hidden;
}

.input-width-enter-from,
.input-width-leave-to {
  width: 0;
  opacity: 0;
}

/*-------------- КНОПКА ОБНОВИТЬ ----------------------- */

.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.6s ease;
  transform: translateX(0);
}
.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(30%);
  opacity: 0;
}

/* ------------------ УДАЛЕНИЕ КОММЕТАРИЯ ---------------------*/
/* Анимация удаления комментария */
/* Появление */
.comment-enter-active {
  transition:
    opacity 0.35s ease,
    transform 0.35s ease,
    max-height 0.35s ease;
  max-height: 200px;
  overflow: hidden;
}

.comment-enter-from {
  opacity: 0;
  transform: translateX(50px) scale(0.9);
  max-height: 0;
}

.comment-enter-to {
  opacity: 1;
  transform: translateX(0) scale(1);
  max-height: 200px;
}

/* Удаление */
.comment-leave-active {
  transition:
    opacity 0.3s ease,
    transform 0.3s ease,
    max-height 0.3s ease;
  max-height: 200px;
  overflow: hidden;
}

.comment-leave-to {
  opacity: 0;
  transform: translateX(50px) scale(0.9);
  max-height: 0;
}
</style>
