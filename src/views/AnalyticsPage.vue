<template>
  <app-page title="Аналитика по кандидатам">
    <div class="w-full max-w-[1350px] mx-auto">
      <!-- ГРАФИКИ -->
      <div class="w-full h-[94vh] py-4">
        <!-- Верхний ряд: Фильтр | AllWorkers | Donat | Source -->
        <div class="w-full h-[45%] mb-4 flex gap-4">
          <!-- 1. Фильтр по годам (вертикальный) -->
          <div class="w-[10%] h-full">
            <div class="h-full p-6 bg-white dark:bg-gray-800 rounded flex flex-col gap-3">
              <span class="font-medium text-gray-800 dark:text-gray-300 mb-1">Годы:</span>
              <div class="overflow-y-auto flex-1">
                <label
                  v-for="year in allYears"
                  :key="year"
                  class="flex items-center mb-1 cursor-pointer text-xl font-medium dark:text-gray-300 text-gray-800"
                >
                  <input
                    type="checkbox"
                    :value="year"
                    v-model="selectedYears"
                    class="mr-3 w-5 h-5 text-red-600"
                  />
                  {{ year }}
                </label>
              </div>
            </div>
          </div>

          <!-- 2. AllWorkersCard -->
          <div class="w-[15%] h-full">
            <AllWorkersCard :workers="filteredWorkers" class="h-full" />
          </div>

          <!-- 3. EmployedDonat -->
          <div class="w-[25%] h-full">
            <EmployedDonat :workers="filteredWorkers" class="h-full" />
          </div>

          <!-- 4. SourceChart -->
          <div class="w-[50%] h-full">
            <SourceChart :workers="filteredWorkers" class="h-full" />
          </div>
        </div>

        <!-- Нижний ряд остаётся без изменений -->
        <div class="w-full h-[40%] flex gap-4">
          <div class="w-1/2 h-full">
            <FullLine :workers="filteredWorkers" class="h-full" />
          </div>
          <div class="w-1/2 h-full">
            <LineEmployee :workers="filteredWorkers" class="h-full" />
          </div>
        </div>
      </div>
    </div>
  </app-page>
</template>

<script setup>
import AppPage from '@/components/ui/AppPage.vue'

import EmployedDonat from '@/components/ui/analytics/EmployedDonat.vue'
import FullLine from '@/components/ui/analytics/FullLine.vue'
import LineEmployee from '@/components/ui/analytics/LineEmployee.vue'
import SourceChart from '@/components/ui/analytics/SourceChart.vue'
import AllWorkersCard from '@/components/ui/analytics/AllWorkersCard.vue'
import { useStore } from 'vuex'
import { computed, ref } from 'vue'
import { watch, nextTick } from 'vue'

const store = useStore()

const workers = computed(() => store.getters['workers/workers'] || [])
const selectedYears = ref([])

const allYears = computed(() => {
  const years = new Set()
  workers.value.forEach((el) => {
    if (el.int_date) {
      const year = new Date(el.int_date).getFullYear()

      // Защита от невалидных дат
      if (!isNaN(year)) years.add(year) // добавляем в СЭТ
    }
  })
  return Array.from(years).sort((a, b) => a - b)
})

//следим за изменениями в массиве лет
watch(
  allYears,
  (years) => {
    if (years.length > 0 && selectedYears.value.length === 0) {
      selectedYears.value = [...years]
    }
  },
  { immediate: true },
)

//Фильтруем работников
const filteredWorkers = computed(() => {
  // Если ничего не выбрано — показываем пустой массив
  if (selectedYears.value.length === 0) {
    return []
  }
  return workers.value.filter((worker) => {
    if (!worker.int_date) return false
    const year = new Date(worker.int_date).getFullYear()
    return selectedYears.value.includes(year)
  })
})
</script>

<style scoped>
.chart-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 2rem;
  padding: 1rem;
  gap: 15px;
}
</style>
