<template>
  <div
    class="flex min-w-1/2 justify-center bg-white rounded-lg shadow-sm dark:bg-gray-800 md:p-6 cursor-pointer"
  >
    <AppLoader v-if="isLoading" class="pb-[130px]"></AppLoader>
    <div v-else>
      <VueApexCharts
        type="bar"
        height="267"
        width="593"
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

// Карта перевода статусов
const textMap = {
  appointed: 'Назначено собеседование',
  employed: 'Трудоустроен(а)',
  fired: 'Уволен(а)',
  refused: 'Отказался',
  to_another: 'Предпочли другого',
  no_contact: 'Не выходит на связь',
  not_suitable: 'Не подходит рук-лю',
  no_show: 'Не явился на собес.',
  thinking: 'Ушел думать',
  medical_failed: 'Не годен по МП',
  medical_referred: 'Ушел на медкомиссию',
}

const store = useStore()
const workers = computed(() => store.getters['workers/workers'] || [])
//Получем флаг о том готовы ли данные

const isLoading = computed(() => store.getters['workers/loading'])

const chartOptions = computed(() => {
  const data = Array.isArray(workers.value) ? workers.value : []

  const counts = data.reduce((acc, el) => {
    const status = el.cur_status || 'unknown'
    acc[status] = (acc[status] || 0) + 1
    return acc
  }, {})

  // ← Используем textMap для перевода x-меток
  const seriesData = Object.entries(counts).map(([statusKey, y]) => ({
    x: textMap[statusKey] || 'Неизвестный статус',
    y,
  }))

  seriesData.sort((a, b) => b.y - a.y)

  return {
    chart: {
      type: 'bar',

      fontFamily: 'Inter, sans-serif',
      toolbar: { show: false },
    },

    title: {
      text: 'Статистика по статусам',
      align: 'center',
      style: {
        fontSize: '16px',
        fontWeight: 'bold',
        color: '#9CA3AF',
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
        colors: ['#9CA3AF'],
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
        style: { colors: '#D1D5DB', fontSize: '11px' },
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
