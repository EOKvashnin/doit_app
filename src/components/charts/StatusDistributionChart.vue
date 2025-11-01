<!-- src/components/charts/StatusDistributionChart.vue -->
<template>
  <div class="bg-gray-800 rounded-xl p-4">
    <h3 class="text-white font-semibold mb-3">Распределение по статусам</h3>
    <apexchart type="donut" height="250" :options="chartOptions" :series="series"></apexchart>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'

const store = useStore()
const workers = computed(() => store.getters['workers/workers'] || [])

const statusCounts = computed(() => {
  const counts = {}
  workers.value.forEach((w) => {
    counts[w.cur_status] = (counts[w.cur_status] || 0) + 1
  })
  return counts
})

const chartOptions = {
  chart: { background: 'transparent' },
  labels: Object.keys(statusCounts.value),
  legend: { show: true, position: 'bottom', labels: { colors: '#ffffff' } },
  plotOptions: { pie: { donut: { size: '60%' } } },
  dataLabels: { enabled: true, style: { colors: ['#ffffff'] } },
  tooltip: { theme: 'dark' },
  responsive: [
    { breakpoint: 480, options: { chart: { width: 200 }, legend: { position: 'bottom' } } },
  ],
}

const series = Object.values(statusCounts.value)
</script>
