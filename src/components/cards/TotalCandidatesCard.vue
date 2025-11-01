<!-- src/components/cards/TotalCandidatesCard.vue -->
<template>
  <div class="bg-gray-800 rounded-xl p-4 text-center">
    <div class="text-gray-400 text-sm mb-1">Всего кандидатов</div>
    <div class="text-2xl font-bold text-white">{{ total }}</div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'

const store = useStore()
const workers = computed(() => store.getters['workers/workers'] || [])
const total = computed(() => workers.value.length)
</script>
