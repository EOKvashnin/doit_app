<template>
  <div class="h-full bg-white rounded-lg shadow-sm dark:bg-gray-800 p-6 cursor-pointer">
    <AppLoader v-if="isLoading" />
    <div v-else class="flex-col items-center text-center justify-center w-full">
      <!-- Иконка -->
      <svg
        class="w-16 h-16 text-gray-800 dark:text-gray-300 mb-4 mx-auto"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        fill="none"
        viewBox="0 0 24 24"
      >
        <path
          stroke="currentColor"
          stroke-linecap="round"
          stroke-width="2"
          d="M4.5 17H4a1 1 0 0 1-1-1 3 3 0 0 1 3-3h1m0-3.05A2.5 2.5 0 1 1 9 5.5M19.5 17h.5a1 1 0 0 0 1-1 3 3 0 0 0-3-3h-1m0-3.05a2.5 2.5 0 1 0-2-4.45m.5 13.5h-7a1 1 0 0 1-1-1 3 3 0 0 1 3-3h3a3 3 0 0 1 3 3 1 1 0 0 1-1 1Zm-1-9.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Z"
        />
      </svg>
      <!-- Подпись -->
      <p class="text-md font-semibold text-gray-800 dark:text-gray-400 mb-2">Всего кандидатов</p>
      <!-- Число -->
      <h5
        class="text-6xl font-bold text-green-500 dark:text-gray-300 hover:text-pink-500 transition-all 0.4s ease"
      >
        {{ length }}
      </h5>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import AppLoader from '../AppLoader.vue'
import { useStore } from 'vuex'

const props = defineProps({
  workers: {
    type: Array,
    required: true,
  },
})

const store = useStore()

//Получем флаг о том готовы ли данные
const isLoading = computed(() => store.getters['workers/loading'])

// Получаем список всех работников из Vuex
// const workers = computed(() => store.getters['workers/workers'] || [])
const workers = computed(() => props.workers)

const length = computed(() => workers.value.length || '')
</script>
