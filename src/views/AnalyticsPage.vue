<template>
  <app-page title="Аналитика по кандидатам">
    <!-- Верхние графики -->

    <div class="w-[1216px] mx-auto flex justify-between items-start gap-4">
      <AllWorkersCard class="justify-start" />

      <EmployedDonat class="justify-start"></EmployedDonat>

      <div class="flex flex-col gap-4 w-1/2">
        <source-chart></source-chart>
      </div>
    </div>

    <!-- Нижние графики -->

    <div class="w-[1216px] mx-auto flex justify-between items-start gap-4 mt-4">
      <full-line class="justify-center"></full-line>
      <line-employee class="justify-center"></line-employee>
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
