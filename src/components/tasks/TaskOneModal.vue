<template>
  <div class="task-modal-content p-4 min-h-[60vh] max-h-[65vh] overflow-y-auto scrollable-column">
    <!-- Заголовок -->
    <div class="mb-4 relative">
      <input
        v-model="localTask.title"
        type="text"
        class="input-modal"
        placeholder="Название задачи"
      />
    </div>

    <!-- Статус и приоритет -->
    <div>
      <label class="label-modal">Описание</label>
      <textarea
        v-model="localTask.description"
        class="area-modal"
        placeholder="Описание задачи"
      ></textarea>
    </div>

    <div class="grid grid-cols-4 gap-4 my-3">
      <div>
        <label class="label-modal">Приоритет</label>
        <select v-model="localTask.priority" class="select-modal">
          <option value="urgent">🔴 Максимальный</option>
          <option value="high">🟠 Высокий</option>
          <option value="medium">🟢 Средний</option>
          <option value="low">🟣 Низкий</option>
        </select>
      </div>
      <div>
        <label class="label-modal">Дедлайн</label>
        <input v-model="localTask.deadline" type="date" class="input-modal" />
      </div>
      <div>
        <label class="label-modal">Направление</label>
        <input v-model="localTask.direction" type="text" class="input-modal" placeholder="..." />
      </div>

      <div>
        <label class="label-modal">Проект (ID)</label>
        <input v-model="localTask.projectId" type="text" class="input-modal" placeholder="..." />
      </div>
    </div>

    <!-- Ответственные -->
    <div class="border-t my-4 border-gray-400/20">
      <h3 class="label-modal">Участники</h3>
      <div class="grid grid-cols-3 gap-3">
        <input
          v-model="localTask.authorFio"
          type="text"
          class="input-modal"
          placeholder="Инициатор"
        />
        <input
          v-model="localTask.assigneeFio"
          type="text"
          class="input-modal"
          placeholder="Исполнитель"
        />
        <input
          v-model="localTask.leadFio"
          type="text"
          class="input-modal"
          placeholder="Руководитель"
        />
      </div>
    </div>

    <!-- Комментарии -->
    <div class="border-t pt-4 border-gray-400/20">
      <h3 class="font-medium mb-2 text-gray-400">
        Комментарии ({{ localTask.comments?.length || 0 }})
      </h3>

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
        <div
          v-for="comment in localTask.comments || []"
          :key="comment.id"
          class="bg-gray-100/10 dark:bg-gray-700/30 border border-gray-400 dark:border-gray-400/10 rounded-xl py-2 px-3 w-fit ml-auto mb-3"
        >
          <li class="flex flex-col justify-center items-end">
            <div class="flex flex-row items-center justify-between gap-5 mb-1">
              <strong class="text-gray-500 text-xs">{{ comment.author }}</strong>
              <span class="text-gray-500 text-xs">{{
                new Intl.DateTimeFormat('ru-RU', { dateStyle: 'short', timeStyle: 'short' }).format(
                  new Date(comment.date),
                )
              }}</span>
            </div>
            <p class="text-gray-800 dark:text-gray-200 text-sm text-right">
              {{ comment.text }}
            </p>
          </li>
        </div>
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
    <transition name="input-width">
      <div v-if="isNeedAddDateEmployment" class="input-wrapper">
        <input
          class="input-modal"
          type="date"
          id="new_employment_Date"
          v-model="new_employment_Date"
          @change="onDateChange"
        />
      </div>
    </transition>
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
import { Icon } from '@iconify/vue'

import { ref, watch } from 'vue'
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'
import { useStore } from 'vuex'
import ConfirmModal from '../ui/ConfirmModal.vue'

const store = useStore()

const props = defineProps({
  task: {
    type: Object,
    required: true,
  },
})

/*---------------------  EMIT  -----------------------*/

const emit = defineEmits(['close', 'update'])

/*-------------------  АНИМАЦИЯ  ---------------------*/

/*----------------  УПРАВЛЕНИЕ MODAL  ----------------*/

const closeModal = () => emit('close')

const showConfirmModal = ref(false)

/*--------------  ЛОКАЛЬНОЕ СОСТОЯНИЕ  ---------------*/

// Создаём локальную копию задачи для редактирования
const localTask = ref({ ...props.task })

// Синхронизируем изменения обратно (опционально — можно эмитить только при сохранении)
watch(
  localTask,
  (newVal) => {
    // Можно эмитить изменения в реальном времени, или при закрытии
    // Пока не эмитим — сохранение по кнопке "Сохранить" будет в будущем
  },
  { deep: true },
)

/*--------------  ОБНОВЛЕНИЕ  ---------------*/

/*---------------  УДАЛЕНИЕ  ----------------*/
// Вызываем модальное коно подтверждения
const removeWithConfirm = () => {
  showConfirmModal.value = true
}
const cancelRemove = () => {
  showConfirmModal.value = false
}

const confirmRemove = async () => {
  try {
    await store.dispatch('tasks/remove', props.task.id)
    toast.success('Задача удалена', {
      position: 'bottom-right',
      autoClose: 1500,
      transition: 'zoom',
    })
    emit('close')
  } catch (error) {
    toast.error('Ошибка при удалении ', error)
  } finally {
    showConfirmModal.value = false // скрываем модалку в любом случае
  }
}

/*----------  НОВЫЙ КОММЕНТАРИЙ  ------------*/
const newCommentText = ref('')

const addComment = () => {
  if (!newCommentText.value.trim()) return

  const newComment = {
    id: Date.now(), // простой ID (в продакшене — лучше UUID или Firebase push key)
    author: props.task.assigneeFio || 'Текущий пользователь', // или брать из auth
    date: new Date().toISOString(),
    text: newCommentText.value.trim(),
  }

  if (!localTask.value.comments) {
    localTask.value.comments = []
  }
  localTask.value.comments.unshift(newComment)
  newCommentText.value = ''
}
</script>

<style scoped>
.task-modal-content {
  font-size: 14px;
}
</style>
