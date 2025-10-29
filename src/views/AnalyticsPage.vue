<template>
  <div class="chart-container">
    <apex-chart type="bar" :options="chartOptions" :series="series" width="600" />
  </div>
</template>

<script setup>
import { computed, onMounted, watch } from 'vue'
import ApexChart from 'vue3-apexcharts'
import { useStore } from 'vuex'

const store = useStore()

onMounted(async () => {
  try {
    await store.dispatch('workers/load')
  } catch (error) {
    console.error('Ошибка при загрузке работников:', error)
  }
})

const workers = computed(() => store.getters['workers/workers'] || [])

// Обновление series и chartOptions при изменении workers
const monthlyCounts = computed(() => {
  if (!workers.value || !Array.isArray(workers.value)) {
    return {}
  }

  const counts = {}

  workers.value.forEach((worker) => {
    const dateStr = worker.int_date // например "2024-06-17"
    if (!dateStr) return // Пропускаем, если дата отсутствует

    const [year, month] = dateStr.split('-') // ['2024', '06', '17']
    const monthKey = `${year}-${month}` // '2024-06'

    counts[monthKey] = (counts[monthKey] || 0) + 1
  })

  // Сортируем ключи (месяцы) по хронологии
  const sortedMonths = Object.keys(counts).sort()

  const categories = sortedMonths
  const data = sortedMonths.map((month) => counts[month])

  return { categories, data }
})

const series = computed(() => [
  {
    name: 'Количество сотрудников',
    data: monthlyCounts.value.data || [],
  },
])

const chartOptions = computed(() => ({
  chart: {
    id: 'workers-by-month',
    fontFamily: 'inherit',
  },
  dataLabels: {
    enabled: true, // ✅ Включаем отображение значений
    style: {
      fontSize: '12px',
      colors: ['#000'], // цвет текста значений
      fontWeight: 600,
    },
    formatter: function (val) {
      return val // отображаем значение как есть
    },
  },
  xaxis: {
    categories: monthlyCounts.value.categories || [],
    title: {
      text: 'Месяцы',
      colors: '#fff',
    },
    labels: {
      style: {
        colors: '#D1D5DB',
      },
    },
  },
  yaxis: {
    title: {
      text: 'Количество сотрудников',
    },
    labels: {
      style: {
        colors: '#D1D5DB',
      },
    },
  },
  colors: ['#E74694'],
  stroke: {
    curve: 'smooth',
    width: 2,
  },
  responsive: [
    {
      breakpoint: 480,
      options: {
        chart: {
          width: 300,
        },
        legend: {
          position: 'bottom',
        },
      },
    },
  ],
}))

// Для отладки
watch(
  workers,
  (newWorkers) => {
    // console.log('workers обновлён:', newWorkers)
    console.log('monthlyCounts:', monthlyCounts.value)
  },
  { immediate: true },
)
</script>
<style scoped>
.chart-container {
  display: flex;
  justify-content: center;
  margin: 2rem;
  border: 1px solid lightgrey;
  border-radius: 10px;
}
</style>
