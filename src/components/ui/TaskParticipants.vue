<template>
  <div class="flex items-center gap-2 flex-wrap">
    <motion.div
      v-for="(email, index) in validExecutors"
      :key="email"
      :initial="{ opacity: 0, scale: 0.8 }"
      :animate="{ opacity: 1, scale: 1 }"
      :exit="{ opacity: 0, scale: 0.8 }"
      :transition="{ delay: index * 0.1, duration: 0.8 }"
      class="flex-shrink-0"
      role="img"
      :aria-label="`Исполнитель: ${getDisplayNameByEmail(email) || email}`"
    >
      <UserAvatar
        :avatar-url="getAvatarByEmail(email)"
        :display-name="getDisplayNameByEmail(email)"
        :tooltip="true"
        :editable="false"
        :size="40"
      />
    </motion.div>

    <span v-if="validExecutors.length === 0" class="text-gray-500 dark:text-gray-400 text-sm">
      Нет исполнителей
    </span>
  </div>
</template>

<script setup lang="ts">
import { motion } from 'motion-v'
import { computed } from 'vue'
import UserAvatar from './UserAvatar.vue'

interface Props {
  executors: string[]
  getAvatarByEmail: (email: string) => string
  getDisplayNameByEmail: (email: string) => string
}

const props = defineProps<Props>()

const validExecutors = computed(() => {
  return props.executors
    .filter((email) => !!email && typeof email === 'string')
    .map((e) => e.trim())
    .filter((e) => e.length > 0)
    .filter((e, i, arr) => arr.indexOf(e) === i)
})
</script>
