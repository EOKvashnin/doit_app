<template>
  <div
    @click="openCard"
    :class="['card', 'priority', getPriorityColor(task.priority), $attrs.class]"
  >
    <!-- Заголовок -->
    <h5 class="mb-2 text-m font-medium tracking-tight text-gray-900 dark:text-white">
      {{ task.title }}
    </h5>

    <!-- Нижний блок: ФИО и комментарии -->
    <div class="flex justify-between items-end mt-auto">
      <p class="text-sm font-thin text-gray-700 dark:text-gray-400">
        {{ task.assigneeFio }}
      </p>
      <!-- Количество комментариев -->
      <div v-if="task.comments" class="flex gap-1 items-center">
        <span class="text-sm text-gray-500">{{ task.comments?.length || 0 }}</span>
        <Icon icon="lucide:message-circle-more" class="w-4 h-4 text-gray-500" />
      </div>
    </div>
  </div>
</template>

<script setup>
import getPriorityColor from '@/utils/priorityColor'
import { Icon } from '@iconify/vue'

const props = defineProps({
  task: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['openModal', 'open-card'])
const openCard = () => {
  emit('open-card', props.task)
}
</script>
