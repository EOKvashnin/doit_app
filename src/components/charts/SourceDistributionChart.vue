<!-- src/components/charts/SourceDistributionChart.vue -->
<template>
  <div class="bg-gray-800 rounded-xl p-4">
    <h3 class="text-white font-semibold mb-3">Источники кандидатов</h3>
    <apexchart type="pie" height="250" :options="chartOptions" :series="series"></apexchart>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'

const store = useStore()
const workers = computed(() => store.getters['workers/workers'] || [])

const sourceCounts = computed(() => {
  const counts = {}
  workers.value.forEach((w) => {
    counts[w.source] = (counts[w.source] || 0) + 1
  })
  return counts
})

const chartOptions = {
  chart: { background: 'transparent' },
  labels: Object.keys(sourceCounts.value),
  legend: { show: true, position: 'bottom', labels: { colors: '#ffffff' } },
  dataLabels: { enabled: true, style: { colors: ['#ffffff'] } },
  tooltip: { theme: 'dark' },
}

const series = Object.values(sourceCounts.value)
</script>
