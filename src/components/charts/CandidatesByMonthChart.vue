<template>
  <div class="bg-gray-800 rounded-xl p-4">
    <h3 class="text-white font-semibold mb-3">Кандидаты по месяцам</h3>
    <apexchart type="line" height="250" :options="chartOptions" :series="series"></apexchart>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'

const store = useStore()
const workers = computed(() => store.getters['workers/workers'] || [])

if (!workers.value.length) {
  console.log('workers.value.length - ', workers.value.length)
}

// Группируем кандидатов по месяцам (по дате интервью)
const monthlyData = computed(() => {
  const data = {}
  workers.value.forEach((w) => {
    if (!w.int_date) return
    const month = w.int_date.substring(0, 7) // YYYY-MM
    data[month] = (data[month] || 0) + 1
  })
  return Object.entries(data).map(([month, count]) => ({ month, count }))
})

console.log('data', monthlyData)

const chartOptions = {
  chartOptions: {
    chart: { background: 'transparent', foreColor: '#ffffff' },
    theme: { mode: 'dark' },
    tooltip: { theme: 'dark' },
    grid: { borderColor: '#374151' },
    xaxis: { labels: { style: { colors: '#ffffff' } } },
    yaxis: { labels: { style: { colors: '#ffffff' } } },
  },
  chart: { background: 'transparent', foreColor: '#ffffff' },
  xaxis: {
    categories: monthlyData.value.map((d) => d.month),
    labels: { style: { colors: '#ffffff' } },
  },
  yaxis: { labels: { style: { colors: '#ffffff' } } },
  tooltip: { theme: 'dark' },
  grid: { borderColor: '#374151' },
}

const series = [
  {
    name: 'Кандидаты',
    data: monthlyData.value.map((d) => d.count),
    color: '#3b82f6',
  },
]
</script>
