<template>
  <div class="m-auto flex flex-col items-center gap-1" :class="centered ? 'py-8' : 'py-4'">
    <div class="text-gray-400 text-sm text-center">
      <slot> Нет задач </slot>
    </div>
    <Icon :icon="icon" class="w-15 h-15 text-gray-400" />
  </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'

const props = defineProps({
  icon: {
    type: String,
    default: 'arcticons:emoji-beach-with-umbrella',
  },
  centered: {
    type: Boolean,
    default: true,
  },
})
</script>
