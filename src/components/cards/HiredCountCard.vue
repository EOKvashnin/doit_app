<!-- src/components/cards/HiredCountCard.vue -->
<template>
  <div class="bg-gray-800 rounded-xl p-4 text-center">
    <div class="text-gray-400 text-sm mb-1">Трудоустроено</div>
    <div class="text-2xl font-bold text-green-400">{{ hired }}</div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'

const store = useStore()
const workers = computed(() => store.getters['workers/workers'] || [])
const hired = computed(() => workers.value.filter((w) => w.employment_Date).length)
</script>
