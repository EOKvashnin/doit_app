<template>
  <app-page title="Аналитика по кандидатам">
    <div class="w-[1216px] mx-auto flex justify-start items-start gap-4">
      <AllWorkersCard class="w-2xl justify-start" />
      <source-chart></source-chart>
    </div>
    <div class="w-[1216px] mx-auto flex justify-start items-start gap-4 mt-4">
      <full-line></full-line>
      <line-employee></line-employee>
    </div>
  </app-page>
</template>

<script setup>
import AppPage from '@/components/ui/AppPage.vue'
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
