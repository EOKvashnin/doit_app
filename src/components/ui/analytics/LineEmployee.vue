<template>
  <div
    class="flex justify-center bg-white rounded-lg shadow-sm dark:bg-gray-800 p-4 md:p-6 cursor-pointer"
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

// Фильтруем только тех, кто "трудоустроен" или "уволен"
const emlFiredWorkers = computed(() =>
  workers.value.filter((w) => w.cur_status === 'employed' || w.cur_status === 'fired'),
)

// Группируем работников по месяцу приёма на работу и формируем данные для графика
const monthlyCounts = computed(() => {
  const counts = {}

  emlFiredWorkers.value.forEach((worker) => {
    const dateStr = worker.int_date
    if (!dateStr) return

    // Извлекаем год и месяц в формате "YYYY-MM"
    const [year, month] = dateStr.split('-')
    const monthKey = `${year}-${month}`

    counts[monthKey] = (counts[monthKey] || 0) + 1
  })

  // Сортируем месяцы хронологически
  const sortedMonths = Object.keys(counts).sort()

  // Форматируем подписи оси X: "янв. 25", "фев. 25" и т.д.
  const categories = sortedMonths.map((key) => {
    const [year, month] = key.split('-')
    const date = new Date(year, month - 1) // Месяцы в JS начинаются с 0
    return date.toLocaleString('ru-RU', { month: 'short', year: '2-digit' })
  })

  // Данные для линии графика
  const data = sortedMonths.map((month) => counts[month])

  return { categories, data }
})

// Серия данных для ApexCharts
const series = computed(() => [
  {
    name: 'Количество сотрудников',
    data: monthlyCounts.value.data,
  },
])

const isDarkMode = computed(() => {
  //логика определения темной темы
  return (
    document.documentElement.classList.contains('dark') ||
    localStorage.theme === 'dark' ||
    (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
  )
})

// Настройки графика
const chartOptions = computed(() => ({
  chart: {
    id: 'workers-by-month',
    fontFamily: 'Roboto, sans-serif',
    toolbar: { show: false },
    zoom: { enabled: false },
    pan: { enabled: false },
    height: '250',
    minHeight: 0,
    // Добавляем настройки отступов
    sparkline: { enabled: false },
    offsetX: 0,
    offsetY: 0,
  },
  title: {
    text: 'Количество трудоустроенных по месяцам',
    align: 'center',
    style: {
      fontSize: '16px',
      fontWeight: 'bold',
      color: !isDarkMode.value ? '#374151' : '#f3f4f6',
      fontFamily: 'inherit',
    },
    // Уменьшаем отступ заголовка
    offsetY: -5,
    margin: 0,
  },
  xaxis: {
    categories: monthlyCounts.value.categories,
    labels: {
      style: { colors: !isDarkMode.value ? '#374151' : '#f3f4f6', fontSize: '10px' },
      rotate: -30,
      offsetY: 0,
      // Убираем дополнительные отступы у меток
      offsetX: 0,
    },
    axisBorder: { show: false },
    axisTicks: { show: false },
    // Важная настройка - позиционирование оси
    position: 'bottom',
    floating: false,
  },
  yaxis: {
    labels: { show: false },
    // Убираем отступы оси Y
    axisBorder: { show: false },
    axisTicks: { show: false },
  },
  grid: {
    show: false,
    padding: {
      bottom: 10,
      left: 0,
      right: 0,
      top: 0,
    },
  },
  // Добавляем общие отступы графика
  plotOptions: {
    bar: {
      borderRadius: 5,
      columnWidth: '90%',
    },
  },
  colors: ['#E74694'],
  stroke: { curve: 'smooth', width: 3 },
  dataLabels: {
    enabled: true,
    formatter: (val) => val,
    offsetY: -10,
    style: {
      fontSize: '14px',
      fontWeight: 'bold',
      //colors: ['#9CA3AF'],
      colors: !isDarkMode.value ? ['#374151'] : ['#f3f4f6'],
      fontFamily: 'inherit',
    },
    background: { enabled: false },
    dropShadow: { enabled: false },
  },
  // Убираем легенду если она есть
  legend: {
    show: false,
  },

  responsive: [
    {
      breakpoint: 480,
      options: {
        chart: { width: 400 },
        // Для мобильных тоже убираем отступы
        grid: {
          padding: {
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
          },
        },
      },
    },
  ],
}))
</script>
