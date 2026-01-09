<template>
  <div
    class="relative inline-block cursor-pointer rounded-full"
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
      class="absolute inset-0 bg-black/30 rounded-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
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
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { computed, ref } from 'vue'

const props = defineProps({
  avatarUrl: { type: String, default: '' },
  displayName: { type: String, default: '' },
  editable: { type: Boolean, default: false },
  size: { type: Number, default: 40 },
})

const emit = defineEmits(['update:avatar'])
const fileInput = ref(null)

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
