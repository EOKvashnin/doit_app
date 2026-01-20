<template>
  <div class="flex items-center gap-2">
    <!-- Анимированный список участников -->
    <motion.div
      v-for="(email, index) in validEmails"
      :key="email"
      :initial="{ opacity: 0, scale: 0.8 }"
      :animate="{ opacity: 1, scale: 1 }"
      :exit="{ opacity: 0, scale: 0.8 }"
      :transition="{ delay: index * 0.1, duration: 0.8 }"
      class="flex-shrink-0"
      role="img"
      :aria-label="`Участник: ${getDisplayNameByEmail(email) || email}`"
    >
      <UserAvatar
        :avatar-url="getAvatarByEmail(email)"
        :display-name="getDisplayNameByEmail(email)"
        :size="40"
        :editable="false"
      />
    </motion.div>

    <!-- Заглушка, если нет участников -->
    <span v-if="validEmails.length === 0" class="text-gray-500 dark:text-gray-400 text-sm">
      Нет участников
    </span>
  </div>
</template>

<script setup lang="ts">
import { motion } from 'motion-v'
import { computed } from 'vue'
import { useStore } from 'vuex'
import UserAvatar from '../ui/UserAvatar.vue'

// 🔹 Типизация пропсов
interface Props {
  leadEmail?: string | null
  assigneeEmail?: string | null
  authorEmail?: string | null
}

const props = defineProps<Props>()

// 🔹 Доступ к Vuex
const store = useStore()

// 🔹 Геттеры из Vuex (как в TaskModal)
const getAvatarByEmail = (email: string) => store.getters['users/getAvatarByEmail'](email)
const getDisplayNameByEmail = (email: string) => store.getters['users/getDisplayNameByEmail'](email)

// 🔹 Фильтруем только валидные email'ы
const validEmails = computed(() => {
  const emails = [props.leadEmail, props.assigneeEmail, props.authorEmail]
  return emails.filter((email): email is string => !!email && typeof email === 'string')
})
</script>
