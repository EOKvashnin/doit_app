<template>
  <div
    class="relative not-even:flex justify-center bg-white rounded-lg shadow-sm dark:bg-gray-800 p-1 md:p-4 cursor-pointer"
  >
    <app-loader v-if="isLoading"></app-loader>

    <!-- Диаграмма -->
    <div v-else class="chart">
      <apex-chart type="radialBar" :options="chartOptions" :series="series" height="300px" />
      <!-- Блок с текстовой информацией поверх диаграммы -->
      <div
        class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center space-y-2"
      >
        <!-- Информация о трудоустроенных -->
        <div class="flex flex-col items-center">
          <p class="text-md font-semibold text-center text-gray-500 dark:text-gray-300">
            Трудоустроено
          </p>
          <div class="flex items-baseline gap-2">
            <svg
              class="w-6 h-6 text-gray-800 dark:text-[#84cc16]"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M16 12h4m-2 2v-4M4 18v-1a3 3 0 0 1 3-3h4a3 3 0 0 1 3 3v1a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1Zm8-10a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
              />
            </svg>
            <!-- Добавлены классы для выравнивания по базовой линии -->
            <h5 class="leading-none text-3xl font-bold text-green-500 dark:text-[#84cc16] pb-1">
              {{ workersEmployedPercent }}%
            </h5>
            <p class="text-sm font-normal text-gray-500/30 dark:text-gray-300/50">
              {{ employedWorkers }} чел.
            </p>
          </div>
        </div>
        <!-- Информация об уволенных -->
        <div class="flex flex-col items-center">
          <!-- Исправлена ошибка: убрана неполная строка 'class=">' -->
          <p class="text-md font-semibold text-center text-gray-500 dark:text-gray-300">Уволено</p>
          <div class="flex items-baseline gap-2">
            <svg
              class="w-6 h-6 text-gray-800 dark:text-pink-500"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M16 12h4M4 18v-1a3 3 0 0 1 3-3h4a3 3 0 0 1 3 3v1a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1Zm8-10a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
              />
            </svg>

            <h5 class="leading-none text-2xl font-bold text-pink-500 dark:text-[#E74694] pb-1">
              <!-- Изменен цвет для соответствия диаграмме -->
              {{ firedPercent }}%
            </h5>
            <p class="text-sm font-normal text-gray-500/30 dark:text-gray-300/50">
              {{ firedWorkers }} чел.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'
import ApexChart from 'vue3-apexcharts'
import AppLoader from '../AppLoader.vue'
const store = useStore()

// Получаем список всех работников из Vuex

const workers = computed(() => store.getters['workers/workers'] || [])

//Получем флаг о том готовы ли данные
const isLoading = computed(() => store.getters['workers/loading'])

const employedWorkers = computed(
  () =>
    workers.value.filter((el) => el.cur_status === 'employed' || el.cur_status === 'fired').length,
)
// Считаем количество трудоустроенных
const workersEmployedPercent = computed(() => {
  const percent = (employedWorkers.value / workers.value.length) * 100
  const roundedPercent = parseInt(percent.toFixed(1))

  return roundedPercent
})

//Считаем количество уволенных
const firedWorkers = computed(() => workers.value.filter((el) => el.cur_status === 'fired').length)

//Процент уволенных по отношению к трудоустроенным

const firedPercent = computed(() => {
  if (employedWorkers.value === 0) return 0
  const percent = (firedWorkers.value / employedWorkers.value) * 100
  const roundPercent = Math.round(percent)

  return roundPercent
})

// Данные для диаграммы
const series = computed(() => [workersEmployedPercent.value, firedPercent.value])

const chartOptions = {
  colors: ['#84cc16', '#D61F69'], // Цвета для сегментов
  chart: {
    height: '350px',
    width: '100%',
    type: 'radialBar',
    sparkline: {
      enabled: true,
    },
  },
  plotOptions: {
    radialBar: {
      track: {
        background: '#374151',
      },
      dataLabels: {
        show: true,
      },
      hollow: {
        margin: 0,
        size: '75%',
      },
    },
  },
  grid: {
    show: false,
    strokeDashArray: 4,
    padding: {
      left: 2,
      right: 2,
      top: -23,
      bottom: -20,
    },
  },
  labels: ['Трудоустроено', 'Уволено'], // Подпись для вашего единственного сегмента
  legend: {
    show: false,
    position: 'bottom',
    fontFamily: 'Inter, sans-serif',
  },
  tooltip: {
    enabled: true,
    x: {
      show: false,
    },
  },
  yaxis: {
    show: false,
    labels: {
      formatter: function (value) {
        return value + '%'
      },
    },
  },
}
</script>
