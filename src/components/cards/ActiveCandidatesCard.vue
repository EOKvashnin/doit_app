<!-- src/components/cards/ActiveCandidatesCard.vue -->
<template>
  <div class="bg-gray-800 rounded-xl p-4 text-center">
    <div class="text-gray-400 text-sm mb-1">Активные кандидаты</div>
    <div class="text-2xl font-bold text-blue-400">{{ active }}</div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'

const store = useStore()
const workers = computed(() => store.getters['workers/workers'] || [])
const active = computed(
  () => workers.value.filter((w) => !w.employment_Date && w.cur_status !== 'to_another').length,
)
</script>
