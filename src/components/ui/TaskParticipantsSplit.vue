<template>
  <div class="flex flex-row gap-6 items-start">
    <!-- Блок Инициатора -->
    <div class="flex flex-col items-center gap-2">
      <h4 class="text-xs font-medium text-gray-500">Инициатор</h4>
      <div v-if="initiatorEmail" class="relative">
        <UserAvatar
          :avatar-url="getAvatarByEmail(initiatorEmail)"
          :display-name="getDisplayNameByEmail(initiatorEmail)"
          :tooltip="true"
          :editable="false"
          :size="42"
        />
      </div>
      <div
        v-else
        class="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center"
      >
        <Icon icon="lucide:user" class="w-6 h-6 text-gray-500" />
      </div>
    </div>

    <!-- Вертикальная разделительная линия -->
    <div class="w-px h-16 bg-gray-300 dark:bg-gray-600 self-center"></div>

    <!-- Блок Исполнителей -->
    <div class="flex flex-col items-start gap-2">
      <h4 class="text-xs font-medium text-gray-500">Исполнители</h4>
      <TaskParticipants
        :executors="executorEmails"
        :get-avatar-by-email="getAvatarByEmail"
        :get-display-name-by-email="getDisplayNameByEmail"
      />
    </div>
  </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import TaskParticipants from './TaskParticipants.vue'
import UserAvatar from './UserAvatar.vue'

const props = defineProps({
  initiatorEmail: {
    type: String,
    required: false,
    default: null,
  },
  executorEmails: {
    type: Array,
    required: true,
    default: () => [],
  },
  // 👇 НОВЫЕ ПРОПСЫ — ГЕТТЕРЫ
  getAvatarByEmail: {
    type: Function,
    required: true,
  },
  getDisplayNameByEmail: {
    type: Function,
    required: true,
  },
})
</script>
