<template>
  <div
    class="cursor-pointer flex justify-center items-center max-h-[313px] bg-white rounded-lg shadow-sm dark:bg-gray-800 p-4 md:p-6"
  >
    <app-loader v-if="isLoading" class="pb-[130px]"></app-loader>
    <div v-else>
      <apex-chart type="line" :options="chartOptions" :series="series" width="600" height="250" />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import ApexChart from 'vue3-apexcharts'
import AppLoader from '../AppLoader.vue'
import { useStore } from 'vuex'

const props = defineProps({
  workers: {
    type: Array,
    required: true,
  },
})
const store = useStore()

// Получаем список всех работников из props
const workers = computed(() => props.workers || [])

//Получем флаг о том готовы ли данные

const isLoading = computed(() => store.getters['workers/loading'])

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

const isDarkMode = computed(() => {
  //логика определения темной темы
  return (
    document.documentElement.classList.contains('dark') ||
    localStorage.theme === 'dark' ||
    (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
  )
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
      color: isDarkMode.value ? '#9CA3AF' : '#374151',
      fontFamily: 'inherit',
    },
  },
  xaxis: {
    categories: monthlyCounts.value.categories,
    labels: {
      style: { colors: isDarkMode.value ? '#9CA3AF' : '#374151', fontSize: '10px' },
      rotate: -30,
      offsetY: 0,
    },
    axisBorder: { show: false },
    axisTicks: { show: false },
  },
  grid: {
    show: false,
    padding: {
      bottom: 40, // ← фиксируем одинаковый нижний отступ для всех графиков
      left: 0,
      right: 0,
      top: 0,
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
      colors: isDarkMode.value ? ['#9CA3AF'] : ['#374151'],
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
