<!-- ColumnHeader.vue -->
<template>
  <div class="flex justify-between py-2 mr-4">
    <div class="flex items-center gap-2">
      <Icon :icon="icon" class="w-5 h-5 text-gray-500 dark:text-gray-300" />
      <h1 class="text-gray-500 dark:text-gray-300 font-medium">
        {{ title }}
      </h1>
      <span class="text-gray-700 font-bold px-1">
        {{ count }}
      </span>
    </div>
    <Icon
      :icon="addIcon"
      class="w-6 h-6 text-gray-300 dark:text-gray-700 hover:text-indigo-600 cursor-pointer transition-colors"
      @click="handleAddTask"
    />
  </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
    required: true,
  },
  count: {
    type: Number,
    default: 0,
  },
  addIcon: {
    type: String,
    default: 'line-md:document-add',
  },
})

const emit = defineEmits(['add-task'])

function handleAddTask() {
  emit('add-task')
}
</script>
