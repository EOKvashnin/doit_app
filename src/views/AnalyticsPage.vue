<template>
  <app-page title="Аналитика по кандидатам">
    <div class="w-full max-w-[1300px] mx-auto">
      <div class="w-full h-[94vh] p-4">
        <!-- Верхний ряд: 15% | 30% | 55% -->
        <div class="w-full h-[45%] mb-4 flex gap-4">
          <!-- 1-й график: 15% -->
          <div class="w-[15%] h-full bg-gray-800 rounded-lg p-2">
            <AllWorkersCard class="h-full" />
          </div>

          <!-- 2-й график: 30% -->
          <div class="w-[30%] h-full bg-gray-800 rounded-lg p-2">
            <EmployedDonat class="h-full" />
          </div>

          <!-- 3-й график: 55% -->
          <div class="w-[55%] h-full bg-gray-800 rounded-lg p-2">
            <source-chart class="h-full" />
          </div>
        </div>

        <!-- Нижний ряд: 50% | 50% -->
        <div class="w-full h-[40%] flex gap-4">
          <!-- Левый график -->
          <div class="w-1/2 h-full bg-gray-800 rounded-lg p-2">
            <full-line class="h-full" />
          </div>

          <!-- Правый график -->
          <div class="w-1/2 h-full bg-gray-800 rounded-lg p-2">
            <line-employee class="h-full" />
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
