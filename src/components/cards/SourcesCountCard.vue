<!-- src/components/cards/SourcesCountCard.vue -->
<template>
  <div class="bg-gray-800 rounded-xl p-4 text-center">
    <div class="text-gray-400 text-sm mb-1">Источников</div>
    <div class="text-2xl font-bold text-purple-400">{{ sources }}</div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'

const store = useStore()
const workers = computed(() => store.getters['workers/workers'] || [])
const sources = computed(() => new Set(workers.value.map((w) => w.source)).size)
</script>
