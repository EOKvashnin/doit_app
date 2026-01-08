<template>
  <span :class="['badge', 'truncate-text', className]">{{ text }}</span>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  status: {
    type: String,
    required: true,
    default: 'new',
    validator: (value) => ['todo', 'in_progress', 'review', 'done'].includes(value),
  },
})

const classMap = {
  todo: 'todo',
  in_progress: 'in_progress',
  review: 'review',
  done: 'done',
}

const textMap = {
  todo: 'Планируется',
  in_progress: 'В работе ',
  review: 'Тестирование',
  done: 'Завершено',
}

const className = computed(() => classMap[props.status] || 'neutral')
const text = computed(() => textMap[props.status] || 'Неизвестный статус')
</script>
