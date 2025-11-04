<template>
  <div
    class="flex flex-col justify-center items-center min-w-[251px] min-h-[330px] bg-white rounded-lg shadow-sm dark:bg-gray-800 p-6"
  >
    <AppLoader v-if="isLoading" />
    <div v-else class="flex flex-col items-center w-full">
      <!-- Иконка -->
      <svg
        class="w-16 h-16 text-gray-800 dark:text-gray-300 mb-4"
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
      <p class="text-md font-semibold text-gray-500 dark:text-gray-400 mb-2">Всего кандидатов</p>
      <!-- Число -->
      <h5 class="text-6xl font-bold text-green-500 dark:text-gray-300">{{ length }}</h5>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import AppLoader from '../AppLoader.vue'
import { useStore } from 'vuex'

const store = useStore()

//Получем флаг о том готовы ли данные
const isLoading = computed(() => store.getters['workers/loading'])

// Получаем список всех работников из Vuex
const workers = computed(() => store.getters['workers/workers'] || [])

const length = computed(() => workers.value.length || '')
</script>
