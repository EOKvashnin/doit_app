<template>
  <div
    class="flex justify-center max-w-2xl w-full bg-white rounded-lg shadow-sm dark:bg-gray-800 p-4 md:p-6"
  >
    <apex-chart type="line" :options="chartOptions" :series="series" width="550" height="250" />
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import ApexChart from 'vue3-apexcharts'
import { useStore } from 'vuex'

const store = useStore()

// Получаем список всех работников из Vuex
const workers = computed(() => store.getters['workers/workers'] || [])

// Группируем всех работников по месяцу приёма на работу (int_date)
const monthlyCounts = computed(() => {
  const counts = {}

  workers.value.forEach((worker) => {
    const dateStr = worker.int_date
    if (!dateStr) return

    // Формируем ключ вида "2025-03"
    const [year, month] = dateStr.split('-')
    const monthKey = `${year}-${month}`

    counts[monthKey] = (counts[monthKey] || 0) + 1
  })

  // Сортируем месяцы хронологически
  const sortedMonths = Object.keys(counts).sort()

  // Форматируем подписи для оси X: "мар. 25", "апр. 25" и т.д.
  const categories = sortedMonths.map((key) => {
    const [year, month] = key.split('-')
    const date = new Date(year, month - 1) // Месяцы в JS начинаются с 0
    return date.toLocaleString('ru-RU', { month: 'short', year: '2-digit' })
  })

  // Данные для линии графика
  const data = sortedMonths.map((month) => counts[month])

  return { categories, data }
})

// Серия данных для графика
const series = computed(() => [
  {
    name: 'Количество кандидатов',
    data: monthlyCounts.value.data || [],
  },
])

// Настройки внешнего вида графика
const chartOptions = computed(() => ({
  chart: {
    id: 'workers-by-month',
    fontFamily: 'Roboto, Inter, Helvetica, Arial, sans-serif',
    toolbar: { show: false }, // Скрываем панель инструментов
    zoom: { enabled: false },
    pan: { enabled: false },
    height: '250',
  },
  title: {
    text: 'Общее количество кандидатов по месяцам',
    align: 'center',
    style: {
      fontSize: '16px',
      fontWeight: 'bold',
      color: '#9CA3AF',
      fontFamily: 'inherit',
    },
  },
  xaxis: {
    categories: monthlyCounts.value.categories,
    labels: {
      style: { colors: '#9CA3AF', fontSize: '10px' },
      rotate: -30,
      offsetY: 0,
    },
    axisBorder: { show: true },
    axisTicks: { show: false },
  },
  grid: {
    show: false,
    padding: {
      bottom: 0,
    },
  },
  yaxis: { labels: { show: false } }, // Скрываем значения по оси Y
  grid: { show: false }, // Убираем сетку
  colors: ['#E74694'], // Цвет линии и точек
  stroke: { curve: 'smooth', width: 3 }, // Сглаженная линия
  dataLabels: {
    enabled: true,
    formatter: (val) => val, // Отображаем число над каждой точкой
    offsetY: -10,
    style: {
      fontSize: '14px',
      fontWeight: 'bold',
      colors: ['#9CA3AF'],
      fontFamily: 'inherit',
    },
    background: { enabled: false }, // Без фона у меток
    dropShadow: { enabled: false },
  },
  responsive: [
    {
      breakpoint: 480,
      options: { chart: { width: 400 } },
    },
  ],
}))
</script>
