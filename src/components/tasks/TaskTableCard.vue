<template>
  <div
    @click="openCard"
    :class="[
      'card',
      'priority',
      getPriorityColor(task.priority),
      $attrs.class,
      'h-full flex flex-col',
    ]"
  >
    <!-- Заголовок -->
    <h5 class="mb-2 text-sm font-medium tracking-tight text-gray-900 dark:text-white">
      {{ task.title }}
    </h5>

    <!-- Исполнители + количество комментариев -->
    <div class="flex flex-row justify-between pl-2 mt-auto">
      <!-- Исполнители (новый блок) -->
      <div v-if="task.executors && task.executors.length > 0" class="mb-2 flex-1">
        <div class="flex items-center gap-2 flex-wrap">
          <!-- Показываем максимум 3 исполнителя -->
          <UserAvatar
            v-for="(executorEmail, index) in visibleExecutors"
            :key="index"
            :avatar-url="avatarUrl(executorEmail)"
            :display-name="displayName(executorEmail)"
            :tooltip="true"
            :editable="false"
            :size="28"
            class="cursor-pointer"
          />
          <!-- Многоточие если исполнителей больше 3 -->
          <span
            v-if="task.executors.length > 3"
            class="text-xs text-gray-500 dark:text-gray-400 font-medium"
          >
            +{{ task.executors.length - 3 }}
          </span>
        </div>
      </div>

      <!-- Количество комментариев -->
      <div v-if="task.comments" class="flex gap-1 items-center flex-shrink-0">
        <span class="text-sm text-gray-500">{{ task.comments?.length || 0 }}</span>
        <Icon icon="lucide:message-circle-more" class="w-4 h-4 text-gray-500" />
      </div>
    </div>
  </div>
</template>

<script setup>
import getPriorityColor from '@/utils/priorityColor'
import { Icon } from '@iconify/vue'
import { computed } from 'vue'
import UserAvatar from '../ui/UserAvatar.vue'

const props = defineProps({
  task: {
    type: Object,
    required: true,
  },
  // Геттеры из стора
  getAvatarByEmail: {
    type: Function,
    required: true,
  },
  getDisplayNameByEmail: {
    type: Function,
    required: true,
  },
})

const emit = defineEmits(['open-card'])

// Вычисляем видимых исполнителей (максимум 3)
const visibleExecutors = computed(() => {
  if (!props.task.executors) return []
  return props.task.executors.slice(0, 3)
})

// Вспомогательные функции для удобства использования
const avatarUrl = (email) => {
  return props.getAvatarByEmail(email) || '/defaultUser.png'
}

const displayName = (email) => {
  return props.getDisplayNameByEmail(email) || email.split('@')[0]
}

const openCard = () => {
  emit('open-card', props.task)
}
</script>

<style scoped>
/* Убедимся, что карточка растягивается на всю высоту */
.card {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
</style>
