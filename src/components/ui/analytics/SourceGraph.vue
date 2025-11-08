<template>
  <div
    class="flex min-w-1/2 justify-center bg-white rounded-lg shadow-sm dark:bg-gray-800 md:p-6 cursor-pointer"
  >
    <AppLoader v-if="isLoading" class="pb-[130px]"></AppLoader>
    <div v-else>
      <VueApexCharts
        type="bar"
        height="267"
        width="410"
        :options="chartOptions"
        :series="chartOptions.series"
      />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import VueApexCharts from 'vue3-apexcharts'
import { useStore } from 'vuex'
import AppLoader from '../AppLoader.vue'

const props = defineProps({
  workers: {
    type: Array,
    required: true,
  },
})

// Карта перевода статусов
const textMap = {
  hh: 'Head Hunter',
  avito: 'Авито',
  telephone: 'Телефон',
  job_center: 'Центр занятости',
  news_sputnik: 'Газета Спутник',
  news_prorab: 'Газета Прораб',
  vk: 'ВКонтакте',
  work_in_russia: 'Работа в России',
  friend: 'Привел друг',
  off_website: 'Сайт ЧЛМЗ',
}

const store = useStore()
const workers = computed(() => props.workers || [])
//Получем флаг о том готовы ли данные

const isLoading = computed(() => store.getters['workers/loading'])

const chartOptions = computed(() => {
  const data = Array.isArray(workers.value) ? workers.value : []

  const counts = data.reduce((acc, el) => {
    const source = el.source || 'unknown'
    acc[source] = (acc[source] || 0) + 1
    return acc
  }, {})

  // ← Используем textMap для перевода x-меток
  const seriesData = Object.entries(counts).map(([sourceKey, y]) => ({
    x: textMap[sourceKey] || 'Неизвестный источник',
    y,
  }))

  const isDarkMode = computed(() => {
    //логика определения темной темы
    return (
      document.documentElement.classList.contains('dark') ||
      localStorage.theme === 'dark' ||
      (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
    )
  })

  seriesData.sort((a, b) => b.y - a.y)

  return {
    chart: {
      type: 'bar',

      fontFamily: 'Inter, sans-serif',
      toolbar: { show: false },
    },

    title: {
      text: 'Источники кандидатов',
      align: 'center',
      style: {
        fontSize: '16px',
        fontWeight: 'bold',
        color: isDarkMode.value ? '#9CA3AF' : '#374151',
        fontFamily: 'inherit',
      },
    },

    colors: ['#E74694'],
    series: [
      {
        name: 'Кандидаты',
        data: seriesData, // ← исправлено!
      },
    ],
    plotOptions: {
      bar: {
        dataLabels: {
          position: 'top',
        },
        horizontal: false,
        columnWidth: '80%',
        borderRadiusApplication: 'end',
        borderRadius: 5,
      },
    },

    // ------ LABEL ---------
    dataLabels: {
      enabled: true,
      enabledOnSeries: undefined,
      formatter: function (val, opts) {
        return val
      },
      textAnchor: 'middle',
      distributed: false,
      offsetX: 0,
      offsetY: -30,
      style: {
        fontSize: '14px',
        fontFamily: 'Roboto, sans-serif',
        fontWeight: 'bold',
        //colors: ['#9CA3AF'],
        colors: isDarkMode.value ? ['#9CA3AF'] : ['#374151'],
      },
      background: {
        enabled: false,
        foreColor: '#fff',
        padding: 4,
        borderRadius: 2,
        borderWidth: 1,
        borderColor: '#fff',
        opacity: 0.9,
        dropShadow: {
          enabled: false,
          top: 1,
          left: 1,
          blur: 1,
          color: '#000',
          opacity: 0.45,
        },
      },
    },
    // ------ Legend ---------
    legend: { show: false },
    xaxis: {
      labels: {
        style: { colors: isDarkMode.value ? '#9CA3AF' : '#374151', fontSize: '11px' },
        rotate: -90,
        offsetY: 0,
        // Убираем дополнительные отступы у меток
        offsetX: 0,
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: { show: false },
    grid: {
      show: false,
      padding: { left: 2, right: 2, top: -14 },
    },

    stroke: { show: true, width: 0, colors: ['transparent'] },
    fill: { opacity: 1 },
    tooltip: {
      style: { fontFamily: 'Inter, sans-serif' },
    },
  }
})
</script>
