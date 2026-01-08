<template>
  <app-page title="Профиль">
    <div
      class="max-w-md mx-auto p-6 bg-gray-100 shadow-2xl dark:bg-gray-800/30 rounded-xl backdrop-blur"
    >
      <div class="flex flex-col items-center mb-6">
        <UserAvatar
          :avatar-url="avatarUrl"
          :display-name="displayName || email"
          :editable="true"
          :size="180"
          @update:avatar="handleAvatarUpdate"
        />
        <p class="mt-2 text-xl font-medium text-gray-700 dark:text-gray-300">
          {{ displayNameLocal }}
        </p>
      </div>

      <div class="mb-3">
        <label class="block text-gray-700 dark:text-gray-300 mb-2">Логин</label>
        <input v-model="email" type="text" class="w-full input-modal mt-1" readonly />
      </div>
      <div class="mb-4">
        <label class="block text-gray-700 dark:text-gray-300 mb-2">Имя в приложении</label>
        <input
          v-model="displayNameLocal"
          type="text"
          class="w-full input-modal"
          placeholder="Введите имя"
        />
      </div>
      <div class="flex gap-3 justify-end">
        <button @click="saveProfile" class="btn" :disabled="!hasChanges">Обновить</button>
        <button @click="close" class="btn-close">Закрыть</button>
      </div>
    </div>
  </app-page>
</template>

<script setup>
import AppPage from '@/components/ui/AppPage.vue'
import UserAvatar from '@/components/ui/UserAvatar.vue'
import { computed, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

const store = useStore()
const router = useRouter()

// Загружаем профиль при входе
onMounted(() => {
  store.dispatch('profile/load')
})

const email = computed(() => store.getters['auth/userEmail'])
const displayName = computed(() => store.getters['profile/displayName'])
const avatarUrl = computed(() => store.getters['profile/avatarUrl'])

// Локальное состояние для редактирования
const displayNameLocal = ref('')
const avatarUrlLocal = ref('')

// Синхронизируем с данными из store
watch(
  displayName,
  (val) => {
    displayNameLocal.value = val || ''
  },
  { immediate: true },
)

watch(
  avatarUrl,
  (val) => {
    avatarUrlLocal.value = val || ''
  },
  { immediate: true },
)

const hasChanges = computed(() => {
  return displayNameLocal.value !== displayName.value || avatarUrlLocal.value !== avatarUrl.value
})

const handleAvatarUpdate = (url) => {
  avatarUrlLocal.value = url
}

const saveProfile = async () => {
  await store.dispatch('profile/save', {
    displayName: displayNameLocal.value,
    avatarUrl: avatarUrlLocal.value,
  })
  // После сохранения можно обновить данные
  store.dispatch('profile/load')
}

const close = () => router.push('/')
</script>
