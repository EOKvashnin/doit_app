<template>
  <p :class="className">
    <Icon :icon="iconName" />
  </p>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { computed } from 'vue'

const props = defineProps({
  priority: {
    type: String,
    required: true,
    default: 'new',
    validator: (value) => ['low', 'medium', 'high', 'urgent', 'new'].includes(value),
  },
})

const classMap = {
  new: 'new-priority',
  low: 'low-priority',
  medium: 'midium-priority',
  high: 'high-priority',
  urgent: 'urgent-priority',
}

const iconMap = {
  new: 'line-md:document-add',
  low: 'line-md:coffee-twotone-loop',
  medium: 'line-md:cog-loop',
  high: 'line-md:lightbulb-filled',
  //urgent: 'majesticons:fire',
  urgent: 'line-md:alert-circle-loop',
}

const className = computed(() => classMap[props.priority] || classMap.low)
const iconName = computed(() => iconMap[props.priority] || iconMap.low)
</script>
