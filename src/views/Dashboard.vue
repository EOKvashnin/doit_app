<template>
  <div class="bg-gray-900 min-h-screen p-6">
    <h1 class="text-2xl font-bold text-white mb-6">Аналитика кандидатов</h1>

    <!-- Карточки -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <TotalCandidatesCard />
      <HiredCountCard />
      <ActiveCandidatesCard />
      <SourcesCountCard />
    </div>

    <!-- Графики -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <CandidatesByMonthChart />
      <HiredByMonthChart />
      <StatusDistributionChart />
      <SourceDistributionChart />
    </div>
  </div>
</template>

<script setup>
import TotalCandidatesCard from '@/components/cards/TotalCandidatesCard.vue'
import HiredCountCard from '@/components/cards/HiredCountCard.vue'
import ActiveCandidatesCard from '@/components/cards/ActiveCandidatesCard.vue'
import SourcesCountCard from '@/components/cards/SourcesCountCard.vue'

import CandidatesByMonthChart from '@/components/charts/CandidatesByMonthChart.vue'
import HiredByMonthChart from '@/components/charts/HiredByMonthChart.vue'
import StatusDistributionChart from '@/components/charts/StatusDistributionChart.vue'
import SourceDistributionChart from '@/components/charts/SourceDistributionChart.vue'
</script>
