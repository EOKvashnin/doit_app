<template>
  <div class="bg-gray-800 rounded-xl p-4">
    <h3 class="text-white font-semibold mb-3">Трудоустроенные по месяцам</h3>
    <apexchart type="bar" height="250" :options="chartOptions" :series="series"></apexchart>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'

const store = useStore()
const workers = computed(() => store.getters['workers/workers'] || [])

// Фильтруем только трудоустроенных (есть дата employment_Date)
const hiredMonthly = computed(() => {
  const data = {}
  workers.value
    .filter((w) => w.employment_Date)
    .forEach((w) => {
      const month = w.employment_Date.substring(0, 7)
      data[month] = (data[month] || 0) + 1
    })
  return Object.entries(data).map(([month, count]) => ({ month, count }))
})

const chartOptions = {
  chart: { background: 'transparent', foreColor: '#ffffff' },
  xaxis: {
    categories: hiredMonthly.value.map((d) => d.month),
    labels: { style: { colors: '#ffffff' } },
  },
  yaxis: { labels: { style: { colors: '#ffffff' } } },
  tooltip: { theme: 'dark' },
  grid: { borderColor: '#374151' },
}

const series = [
  {
    name: 'Трудоустроенные',
    data: hiredMonthly.value.map((d) => d.count),
    color: '#10b981',
  },
]
</script>
