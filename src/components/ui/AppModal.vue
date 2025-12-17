<template>
  <div class="modal-wrapper">
    <!-- Добавлен корневой элемент -->
    <div class="modal-backdrop" @click.self="close"></div>
    <div class="modal">
      <div
        class="flex flex-row gap-3 justify-center items-center text-2xl px-1 font-medium text-gray-500 dark:text-gray-300"
        v-if="title"
      >
        <app-priority :priority="priority" />
        <h3 class="text-center">{{ title }}</h3>
      </div>
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
import AppPriority from './AppPriority.vue'

defineProps({
  title: {
    type: String,
    default: '',
  },
  priority: {
    type: String,
    default: 'new',
    validator: (value) => {
      return ['low', 'medium', 'high', 'urgent', 'new'].includes(value)
    },
  },
})

const emit = defineEmits(['close'])

const close = () => {
  emit('close')
}
</script>
