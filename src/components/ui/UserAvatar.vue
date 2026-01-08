<template>
  <div
    class="relative inline-block cursor-pointer rounded-full"
    :style="{ width: sizePx + 'px', height: sizePx + 'px' }"
    @click="onEdit"
  >
    <!-- Фон с инициалами -->
    <div
      v-if="!avatarUrl"
      class="w-full h-full rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold"
      :style="{ fontSize: fontSize }"
    >
      {{ initials }}
    </div>

    <!-- Изображение -->
    <img
      v-else
      :src="avatarUrl"
      alt="Аватар"
      class="w-full h-full rounded-full object-cover border-2 border-gray-400 dark:border-white shadow-lg"
    />

    <!-- Оверлей редактирования -->
    <div
      v-if="editable"
      class="absolute inset-0 bg-black/30 rounded-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
    >
      <Icon
        icon="lucide:camera"
        class="text-white"
        :style="{ width: iconSize, height: iconSize }"
      />
    </div>

    <!-- Скрытое поле загрузки -->
    <input
      v-if="editable"
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
  size: { type: Number, default: 40 }, // размер в пикселях
})

const emit = defineEmits(['update:avatar'])

const fileInput = ref(null)

const initials = computed(() => {
  if (!props.displayName) return '??'
  return props.displayName
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .substring(0, 2)
})

// Размер в пикселях как строка: '40px'
const sizePx = computed(() => props.size)

// Размер иконки камеры — ~40% от аватара
const iconSize = computed(() => `${Math.max(16, props.size * 0.4)}px`)

// Размер шрифта — ~50% от аватара
const fontSize = computed(() => `${Math.max(12, props.size * 0.5)}px`)

const onEdit = () => {
  if (props.editable) fileInput.value?.click()
}

const onFileChange = async (e) => {
  const file = e.target.files[0]
  if (!file) return

  const url = await uploadAvatar(file)
  emit('update:avatar', url)
}

const uploadAvatar = (file) => {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.readAsDataURL(file)
  })
}
</script>
