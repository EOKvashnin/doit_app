<template>
  <div
    ref="avatarContainer"
    class="relative inline-block group"
    @mouseenter="showTooltip = true"
    @mouseleave="showTooltip = false"
    @focusin="showTooltip = true"
    @focusout="showTooltip = false"
  >
    <!-- Основная аватарка -->
    <div
      class="cursor-pointer rounded-full"
      :style="{ width: sizePx + 'px', height: sizePx + 'px' }"
      @click="onEdit"
    >
      <img
        :src="resolvedAvatarUrl"
        :alt="props.displayName || 'Пользователь'"
        class="w-full h-full rounded-full object-cover border-2 border-gray-400 dark:border-white shadow-lg"
        @error="handleImageError"
      />

      <div
        v-if="props.editable"
        class="absolute inset-0 bg-black/30 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <Icon
          icon="lucide:camera"
          class="text-white"
          :style="{ width: iconSize, height: iconSize }"
        />
      </div>

      <input
        v-if="props.editable"
        ref="fileInput"
        type="file"
        accept="image/*"
        class="hidden"
        @change="onFileChange"
      />
    </div>

    <!-- Телепорт тултипа в body -->
    <Teleport to="body">
      <div
        v-if="props.tooltip && showTooltip"
        class="fixed z-50 pointer-events-none"
        :style="tooltipStyle"
      >
        <div
          class="flex flex-col items-center gap-2 px-3 py-2 bg-indigo-600 text-white text-xs rounded-lg shadow-xl whitespace-nowrap"
        >
          <img
            :src="resolvedAvatarUrl"
            :alt="props.tooltipName || props.displayName || 'Пользователь'"
            class="w-20 h-20 rounded-full object-cover border-2 border-white shadow-md"
            @error="handleImageError"
          />
          <span>{{ props.tooltipName || props.displayName }}</span>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { computed, ref } from 'vue'

const props = defineProps({
  avatarUrl: { type: String, default: '' },
  displayName: { type: String, default: '' },
  editable: { type: Boolean, default: false },
  size: { type: Number, default: 40 },
  tooltip: { type: Boolean, default: false },
  tooltipName: { type: String, default: '' },
})

const emit = defineEmits(['update:avatar'])
const fileInput = ref(null)
const showTooltip = ref(false)
const avatarContainer = ref(null)

// 💡 Вычисляем позицию тултипа относительно аватарки
const tooltipStyle = computed(() => {
  if (!showTooltip.value || !avatarContainer.value) return { display: 'none' }

  // Получаем размеры и позицию аватарки
  const rect = avatarContainer.value.getBoundingClientRect()

  const { top, left, width } = rect

  // Позиция тултипа: строго над аватаркой, по центру
  const tooltipTop = top - 130 // отступ сверху
  const tooltipLeft = left + width / 2 // центр по горизонтали

  return {
    top: `${tooltipTop}px`,
    left: `${tooltipLeft}px`,
    transform: 'translateX(-50%)',
    zIndex: 9999,
  }
})

const DEFAULT_AVATAR = '/defaultUser.png'

const resolvedAvatarUrl = computed(() => {
  return props.avatarUrl || DEFAULT_AVATAR
})

const sizePx = computed(() => props.size)
const iconSize = computed(() => `${Math.max(16, props.size * 0.4)}px`)

const onEdit = () => {
  if (props.editable) fileInput.value?.click()
}

const onFileChange = (e) => {
  const file = e.target.files?.[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = () => emit('update:avatar', reader.result)
  reader.readAsDataURL(file)
}

const handleImageError = (event) => {
  event.target.src = DEFAULT_AVATAR
}
</script>
